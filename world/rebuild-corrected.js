(function () {
  "use strict";

  const CONFIG = {
    layoutUrl: "../data/world/town-layout.stage1-corrected.json",
    assetRoot: "../Assets/Images and Animations/Career Empire World/",
    player: { width: 96, height: 144, originX: 0.5, originY: 0.9375, walk: 185, run: 275 },
    camera: { walk: 1, travel: 0.94, approach: 1.045, aerial: 0.43 },
    path: { main: 104, foot: 58 }
  };

  const ASSETS = {
    grass: "terrain/CE-TERRAIN-001-base-grass.png",
    grassFlowers: "terrain/CE-TERRAIN-002-grass-flowers.png",
    grassWorn: "terrain/CE-TERRAIN-003-grass-worn.png",
    plaza: "paths/CE-PATH-001-plaza-stone-base.png",
    water: "water/CE-WATER-001-base-water.png",
    shore: "water/CE-WATER-002-shore-edge.png",
    bridge: "water/CE-WATER-004-bridge.png",
    homeBase: "buildings/CE-BLDG-001-home-base.png",
    skillsCentre: "buildings/CE-BLDG-005-initiative-workshop.png",
    estPrep: "buildings/CE-BLDG-002-est-prep-lab.png",
    megatrends: "buildings/CE-BLDG-003-megatrends-centre.png",
    townHall: "buildings/CE-BLDG-008-town-hall.png",
    shop: "buildings/CE-BLDG-007-global-shop.png",
    lamp: "props/CE-PROP-001-street-lamp.png",
    sign: "props/CE-PROP-002-wayfinding-sign.png",
    marker: "props/CE-PROP-003-hologram-marker.png",
    bench: "props/CE-PROP-004-campus-bench.png",
    planter: "props/CE-PROP-005-planter.png",
    treeSmall: "props/CE-PROP-006-tree-small.png",
    treeLarge: "props/CE-PROP-007-tree-large.png",
    bin: "props/CE-PROP-008-campus-bin.png",
    bikeRack: "props/CE-PROP-009-bike-rack.png",
    banner: "props/CE-PROP-011-community-banner.png"
  };

  const POSES = {
    idleBack: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-back-3q.png",
    walkBackA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-back-3q-a.png",
    walkBackB: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-back-3q-b.png",
    idleFront: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-front-3q.png",
    idleLeft: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-left-3q.png",
    idleRight: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-right-3q.png",
    walkLeftA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-left-3q-a.png",
    walkRightA: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-walk-right-3q-a.png"
  };

  const BOUNDS = {
    homeBase: { sw: 1024, sh: 1024, x: 2, y: 207, w: 1020, h: 609 },
    skillsCentre: { sw: 1024, sh: 1024, x: 2, y: 196, w: 1020, h: 632 },
    estPrep: { sw: 1024, sh: 1024, x: 1, y: 182, w: 1022, h: 659 },
    megatrends: { sw: 1024, sh: 1024, x: 2, y: 153, w: 1020, h: 718 },
    townHall: { sw: 1024, sh: 1024, x: 22, y: 200, w: 982, h: 632 },
    shop: { sw: 1024, sh: 1024, x: 2, y: 167, w: 1021, h: 690 },
    lamp: { sw: 512, sh: 512, x: 190, y: 16, w: 132, h: 484 },
    sign: { sw: 512, sh: 512, x: 88, y: 16, w: 335, h: 484 },
    marker: { sw: 512, sh: 512, x: 80, y: 16, w: 353, h: 483 },
    bench: { sw: 512, sh: 512, x: 12, y: 143, w: 488, h: 357 },
    planter: { sw: 512, sh: 512, x: 19, y: 34, w: 474, h: 466 },
    treeSmall: { sw: 512, sh: 512, x: 94, y: 16, w: 323, h: 484 },
    treeLarge: { sw: 512, sh: 512, x: 19, y: 16, w: 473, h: 483 },
    bin: { sw: 512, sh: 512, x: 50, y: 16, w: 412, h: 484 },
    bikeRack: { sw: 512, sh: 512, x: 15, y: 128, w: 481, h: 372 },
    banner: { sw: 512, sh: 512, x: 28, y: 16, w: 456, h: 484 }
  };

  function hex(value) {
    return Phaser.Display.Color.HexStringToColor(value).color;
  }

  class CorrectedTownScene extends Phaser.Scene {
    constructor() {
      super("CorrectedTownScene");
      this.layout = null;
      this.player = null;
      this.keys = null;
      this.direction = "back";
      this.walkDistance = 0;
      this.routeGraph = new Map();
      this.routePath = [];
      this.colliders = [];
      this.destinations = [];
      this.currentDestination = null;
      this.aerial = false;
      this.zoomTarget = CONFIG.camera.walk;
    }

    preload() {
      this.load.json("correctedLayout", CONFIG.layoutUrl);
      Object.entries(ASSETS).forEach(([key, path]) => this.load.image(key, CONFIG.assetRoot + path));
      Object.entries(POSES).forEach(([key, path]) => this.load.image(key, CONFIG.assetRoot + path));
    }

    create() {
      this.layout = this.cache.json.get("correctedLayout");
      document.querySelector(".corrected-loading")?.remove();
      this.cameras.main.setBackgroundColor("#173c2a");
      this.cameras.main.setBounds(0, 0, this.layout.world.width, this.layout.world.height);
      this.buildRouteGraph();
      this.drawGround();
      this.drawPrecincts();
      this.drawWaterEdge();
      this.drawRoutes();
      this.drawCivicHeart();
      this.drawDestinations();
      this.drawProps();
      this.createPlayer();
      this.createMinimap();
      this.setupInput();
      this.updatePanel(null);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 20);
      this.cameras.main.setZoom(CONFIG.camera.walk);
    }

    buildRouteGraph() {
      this.layout.routeNodes.forEach((node) => this.routeGraph.set(node.id, { ...node, links: [] }));
      this.layout.routeLinks.forEach(([a, b]) => {
        this.routeGraph.get(a)?.links.push(b);
        this.routeGraph.get(b)?.links.push(a);
      });
    }

    drawGround() {
      this.add.rectangle(this.layout.world.width / 2, this.layout.world.height / 2, this.layout.world.width, this.layout.world.height, 0x2f6742).setDepth(-300);
      for (let x = 0; x < this.layout.world.width; x += 256) {
        for (let y = 0; y < this.layout.world.height; y += 256) {
          const n = (x / 256) + (y / 256) * 3;
          const key = n % 7 === 0 ? "grassFlowers" : n % 9 === 0 ? "grassWorn" : "grass";
          this.add.image(x + 128, y + 128, key).setDisplaySize(258, 258).setAlpha(0.73).setDepth(-295);
        }
      }
    }

    drawPrecincts() {
      const g = this.add.graphics().setDepth(-260);
      this.layout.precincts.forEach((p) => {
        g.fillStyle(hex(p.color), 0.15);
        g.fillRoundedRect(p.x, p.y, p.width, p.height, 76);
        g.lineStyle(3, hex(p.color), 0.38);
        g.strokeRoundedRect(p.x, p.y, p.width, p.height, 76);
        this.add.text(p.x + 28, p.y + 24, p.title.toUpperCase(), {
          fontFamily: "Outfit, sans-serif", fontSize: "17px", fontStyle: "800", color: "#eaf8ff",
          stroke: "#0c2a28", strokeThickness: 5
        }).setAlpha(0.76).setDepth(-30);
      });
    }

    drawWaterEdge() {
      const g = this.add.graphics().setDepth(-270);
      g.fillStyle(0x075170, 0.92);
      g.fillEllipse(960, -45, 1220, 270);
      g.lineStyle(14, 0x69d9df, 0.2);
      g.strokeEllipse(960, -45, 1220, 270);
    }

    routePoints(route) {
      const points = route.points.map(([x, y]) => new Phaser.Math.Vector2(x, y));
      if (route.closed) points.push(points[0].clone(), points[1].clone());
      return new Phaser.Curves.Spline(points).getSpacedPoints(route.closed ? 170 : Math.max(24, route.points.length * 22));
    }

    drawRoutes() {
      const road = this.add.graphics().setDepth(-190);
      this.layout.routes.forEach((route) => {
        const points = this.routePoints(route);
        const width = route.type === "main" ? CONFIG.path.main : CONFIG.path.foot;
        road.lineStyle(width + 18, 0x0a1b25, 0.5);
        road.strokePoints(points, false);
        road.lineStyle(width, route.type === "main" ? 0x344b5c : 0x71847e, 0.98);
        road.strokePoints(points, false);
        road.lineStyle(route.type === "main" ? 3 : 2, route.type === "main" ? 0x55d7e8 : 0xa3f0bc, route.type === "main" ? 0.48 : 0.32);
        road.strokePoints(points, false);
      });
    }

    drawCivicHeart() {
      this.add.ellipse(960, 805, 350, 240, 0x293b43, 1).setStrokeStyle(8, 0x6bd7ed, 0.4).setDepth(-175);
      this.add.ellipse(960, 805, 250, 165, 0x59604d, 0.78).setStrokeStyle(3, 0xffd166, 0.48).setDepth(-170);
      this.add.text(960, 805, "TOWN SQUARE", {
        fontFamily: "Outfit, sans-serif", fontSize: "21px", fontStyle: "800", color: "#f3fbff",
        stroke: "#071622", strokeThickness: 5
      }).setOrigin(0.5).setDepth(-25);
    }

    addBoundedImage(key, x, baseY, objectHeight) {
      const b = BOUNDS[key];
      const scale = objectHeight / b.h;
      const occupiedBottom = b.y + b.h;
      const imageY = baseY - (occupiedBottom - b.sh / 2) * scale;
      return this.add.image(x, imageY, key)
        .setDisplaySize(b.sw * scale, b.sh * scale)
        .setDepth(baseY);
    }

    drawDestinations() {
      this.layout.destinations.forEach((d) => {
        if (d.asset) this.addBoundedImage(d.asset, d.x, d.baseY, d.objectHeight);
        if (d.collision) {
          const [x, y, width, height] = d.collision;
          this.colliders.push({ type: "rect", x, y, width, height });
        }
        this.destinations.push({ ...d, entrance: { x: d.entrance[0], y: d.entrance[1] } });
        if (d.id !== "town-square") {
          this.add.ellipse(d.entrance[0], d.entrance[1] + 4, 76, 32, 0x67d8ff, 0.12)
            .setStrokeStyle(2, 0x67d8ff, 0.45).setDepth(d.entrance[1] - 10);
        }
      });
    }

    drawProps() {
      this.layout.props.forEach((p) => {
        const image = this.addBoundedImage(p.asset, p.x, p.y, p.objectHeight);
        image.setDepth(p.y + (p.asset.includes("tree") ? 8 : 0));
        if (p.collision) {
          const [x, y, radius] = p.collision;
          this.colliders.push({ type: "circle", x, y, radius });
        }
        if (p.collisionRect) {
          const [x, y, width, height] = p.collisionRect;
          this.colliders.push({ type: "rect", x, y, width, height });
        }
      });
    }

    createPlayer() {
      this.player = this.add.sprite(365, 1260, "idleBack")
        .setDisplaySize(CONFIG.player.width, CONFIG.player.height)
        .setOrigin(CONFIG.player.originX, CONFIG.player.originY)
        .setDepth(1300);
      this.shadow = this.add.ellipse(this.player.x, this.player.y + 3, 64, 11, 0x06131b, 0.38).setDepth(this.player.y - 2);
    }

    setupInput() {
      this.keys = this.input.keyboard.addKeys({
        up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT",
        w: "W", a: "A", s: "S", d: "D", shift: "SHIFT", m: "M", enter: "ENTER"
      });
      this.input.on("pointerdown", (pointer) => {
        const point = pointer.positionToCamera(this.cameras.main);
        const clickedDestination = this.destinations.reduce((best, d) => {
          const distance = Phaser.Math.Distance.Between(point.x, point.y, d.x || d.entrance.x, d.baseY || d.entrance.y);
          return !best || distance < best.distance ? { d, distance } : best;
        }, null);
        const target = clickedDestination?.distance < 220 ? clickedDestination.d.entrance : point;
        this.routePath = this.findRoute({ x: this.player.x, y: this.player.y }, target);
        if (this.aerial) this.exitAerial();
      });
      this.input.keyboard.on("keydown-M", () => this.toggleAerial());
      this.input.keyboard.on("keydown-ENTER", () => this.enterDestination());
      document.getElementById("corrected-aerial")?.addEventListener("click", () => this.toggleAerial());
      document.getElementById("corrected-enter")?.addEventListener("click", () => this.enterDestination());
    }

    update(_time, delta) {
      if (!this.player || !this.keys) return;
      const manual = this.manualVector();
      const running = this.keys.shift.isDown;
      let velocity = new Phaser.Math.Vector2();
      if (manual.lengthSq()) {
        if (this.aerial) this.exitAerial();
        this.routePath = [];
        velocity = manual.normalize().scale(running ? CONFIG.player.run : CONFIG.player.walk);
      } else if (this.routePath.length) {
        velocity = this.routeVelocity(running ? CONFIG.player.run : CONFIG.player.walk);
      }
      this.move(velocity, delta);
      this.animatePlayer(velocity, delta);
      this.directCamera(velocity, running);
      this.updateInteraction();
      this.updateMinimap();
    }

    manualVector() {
      const x = (this.keys.right.isDown || this.keys.d.isDown ? 1 : 0) - (this.keys.left.isDown || this.keys.a.isDown ? 1 : 0);
      const y = (this.keys.down.isDown || this.keys.s.isDown ? 1 : 0) - (this.keys.up.isDown || this.keys.w.isDown ? 1 : 0);
      return new Phaser.Math.Vector2(x, y);
    }

    routeVelocity(speed) {
      const target = this.routePath[0];
      const vector = new Phaser.Math.Vector2(target.x - this.player.x, target.y - this.player.y);
      if (vector.length() < 14) { this.routePath.shift(); return new Phaser.Math.Vector2(); }
      return vector.normalize().scale(speed);
    }

    move(velocity, delta) {
      const step = velocity.clone().scale(delta / 1000);
      const nx = { x: Phaser.Math.Clamp(this.player.x + step.x, 35, this.layout.world.width - 35), y: this.player.y };
      const ny = { x: this.player.x, y: Phaser.Math.Clamp(this.player.y + step.y, 70, this.layout.world.height - 30) };
      if (!this.blocked(nx)) this.player.x = nx.x;
      if (!this.blocked(ny)) this.player.y = ny.y;
      this.player.setDepth(this.player.y + 32);
      this.shadow.setPosition(this.player.x, this.player.y + 3).setDepth(this.player.y - 2);
    }

    blocked(point) {
      const r = 11;
      return this.colliders.some((c) => c.type === "circle"
        ? Phaser.Math.Distance.Between(point.x, point.y, c.x, c.y) < c.radius + r
        : point.x > c.x - c.width / 2 - r && point.x < c.x + c.width / 2 + r && point.y > c.y - c.height / 2 - r && point.y < c.y + c.height / 2 + r);
    }

    animatePlayer(v, delta) {
      const moving = v.lengthSq() > 10;
      if (moving) {
        this.walkDistance += v.length() * delta / 1000;
        if (Math.abs(v.x) > Math.abs(v.y) * 0.9) this.direction = v.x < 0 ? "left" : "right";
        else this.direction = v.y < 0 ? "back" : "front";
      }
      let pose = this.direction === "back" ? "idleBack" : this.direction === "left" ? "idleLeft" : this.direction === "right" ? "idleRight" : "idleFront";
      if (moving) {
        const phase = Math.floor(this.walkDistance / 28) % 3;
        if (this.direction === "back") pose = phase === 0 ? "idleBack" : phase === 1 ? "walkBackA" : "walkBackB";
        if (this.direction === "left") pose = phase % 2 ? "walkLeftA" : "idleLeft";
        if (this.direction === "right") pose = phase % 2 ? "walkRightA" : "idleRight";
      }
      this.player.setTexture(pose).setDisplaySize(CONFIG.player.width, CONFIG.player.height);
    }

    directCamera(v, running) {
      if (this.aerial) return;
      const near = this.nearestDestination(155);
      const target = near ? CONFIG.camera.approach : running || this.routePath.length ? CONFIG.camera.travel : CONFIG.camera.walk;
      if (Math.abs(target - this.zoomTarget) > 0.01) { this.zoomTarget = target; this.cameras.main.zoomTo(target, 380, "Sine.easeOut"); }
      const lookX = Phaser.Math.Clamp(v.x * 0.2, -46, 46);
      const lookY = Phaser.Math.Clamp(v.y * 0.12, -25, 32);
      const focusX = near ? Phaser.Math.Clamp((near.entrance.x - this.player.x) * 0.25, -70, 70) : lookX;
      const focusY = near ? Phaser.Math.Clamp((near.entrance.y - this.player.y) * 0.18, -40, 45) : lookY;
      this.cameras.main.setFollowOffset(-focusX, 20 - focusY);
    }

    updateInteraction() {
      const d = this.nearestDestination(92);
      if (d?.id !== this.currentDestination?.id) { this.currentDestination = d; this.updatePanel(d); }
    }

    nearestDestination(radius) {
      let best = null;
      this.destinations.forEach((d) => {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, d.entrance.x, d.entrance.y);
        if (distance <= (d.id === "town-square" ? 145 : radius) && (!best || distance < best.distance)) best = { ...d, distance };
      });
      return best;
    }

    updatePanel(d) {
      const type = document.getElementById("corrected-type");
      const title = document.getElementById("corrected-title");
      const detail = document.getElementById("corrected-detail");
      const button = document.getElementById("corrected-enter");
      if (!d) {
        type.textContent = "Current area"; title.textContent = "Career Empire Town";
        detail.textContent = "Follow the connected streets. Each short journey should reveal the next destination or landmark.";
        button.textContent = "Move near an entrance"; button.disabled = true; return;
      }
      type.textContent = d.type; title.textContent = d.title; detail.textContent = d.detail;
      button.textContent = d.href ? `Enter ${d.title}` : "Exterior preview"; button.disabled = !d.href;
    }

    enterDestination() { if (this.currentDestination?.href) window.location.href = this.currentDestination.href; }

    toggleAerial() { if (this.aerial) this.exitAerial(); else this.enterAerial(); }
    enterAerial() {
      this.aerial = true; this.routePath = []; this.cameras.main.stopFollow();
      this.cameras.main.pan(this.layout.world.width / 2, this.layout.world.height / 2, 380, "Sine.easeInOut");
      this.cameras.main.zoomTo(CONFIG.camera.aerial, 380, "Sine.easeInOut");
    }
    exitAerial() {
      this.aerial = false; this.zoomTarget = CONFIG.camera.walk;
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 20);
      this.cameras.main.zoomTo(CONFIG.camera.walk, 340, "Sine.easeInOut");
    }

    findRoute(from, to) {
      const start = this.closestNode(from); const end = this.closestNode(to);
      if (!start || !end) return [to];
      const open = [start.id], came = new Map(), score = new Map([[start.id, 0]]);
      while (open.length) {
        open.sort((a, b) => score.get(a) - score.get(b));
        const id = open.shift(); if (id === end.id) break;
        const node = this.routeGraph.get(id);
        node.links.forEach((nextId) => {
          const next = this.routeGraph.get(nextId);
          const value = score.get(id) + Phaser.Math.Distance.Between(node.x, node.y, next.x, next.y);
          if (!score.has(nextId) || value < score.get(nextId)) { came.set(nextId, id); score.set(nextId, value); if (!open.includes(nextId)) open.push(nextId); }
        });
      }
      const ids = [end.id]; let id = end.id;
      while (came.has(id)) { id = came.get(id); ids.unshift(id); }
      return ids.slice(1).map((nodeId) => { const n = this.routeGraph.get(nodeId); return { x: n.x, y: n.y }; });
    }

    closestNode(point) {
      let best = null;
      this.routeGraph.forEach((n) => { const d = Phaser.Math.Distance.Between(point.x, point.y, n.x, n.y); if (!best || d < best.distance) best = { ...n, distance: d }; });
      return best;
    }

    createMinimap() {
      this.minimap = { base: this.add.graphics().setScrollFactor(0).setDepth(9000), lines: this.add.graphics().setScrollFactor(0).setDepth(9001), player: this.add.graphics().setScrollFactor(0).setDepth(9002) };
    }

    updateMinimap() {
      const w = 166, h = 126, m = 18, x = this.cameras.main.width - w - m, y = this.cameras.main.height - h - m;
      const sx = w / this.layout.world.width, sy = h / this.layout.world.height;
      this.minimap.base.clear().fillStyle(0x061622, 0.82).fillRoundedRect(x, y, w, h, 10).lineStyle(1, 0x67d8ff, 0.4).strokeRoundedRect(x, y, w, h, 10);
      this.minimap.lines.clear();
      this.layout.routeLinks.forEach(([a, b]) => { const na = this.routeGraph.get(a), nb = this.routeGraph.get(b); this.minimap.lines.lineStyle(2, 0x67d8ff, 0.45).lineBetween(x + na.x * sx, y + na.y * sy, x + nb.x * sx, y + nb.y * sy); });
      this.destinations.forEach((d) => this.minimap.lines.fillStyle(0x9cf0b9, 0.9).fillCircle(x + d.entrance.x * sx, y + d.entrance.y * sy, 3));
      this.minimap.player.clear().fillStyle(0xffd166, 1).fillCircle(x + this.player.x * sx, y + this.player.y * sy, 4);
    }
  }

  window.addEventListener("load", () => {
    const container = document.getElementById("corrected-game");
    if (!container || !window.Phaser) return;
    new Phaser.Game({
      type: Phaser.AUTO, parent: "corrected-game", width: container.clientWidth, height: container.clientHeight,
      backgroundColor: "#173c2a", scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: CorrectedTownScene
    });
  });
})();
