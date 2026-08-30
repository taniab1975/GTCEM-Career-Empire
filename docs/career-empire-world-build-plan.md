# Career Empire World Build Plan

Working document for building the Phaser world-map experience.

## Current Direction

Career Empire World should feel like a living learning town, not a static game board.

The town starts muted, underbuilt, and partly inactive. As the class learns, earns, votes, and contributes, the environment becomes brighter, richer, more connected, and more alive.

The world itself is the community progress meter.

The curriculum-to-world journey map is tracked in `docs/career-empire-curriculum-journey-map.md`. Use that document before rebuilding the Phaser map so each district, building, portal, and story event has a clear curriculum purpose.

## Current Status

- Phaser world exists at `world/index.html`.
- Local reload path: `http://localhost:8001/world/index.html`.
- Mini-map and compass are started.
- First character controller test is working for `CE-CHAR-B01 Boy Student Explorer`.
- B01 supports WASD/arrows, Shift run, Space jump, P point, and C celebrate.
- B01 uses transparent runtime PNGs with locked origin `0.5, 0.9375`.
- The map is now structured as a hub town with current destinations, community transformation zones, and reserved future districts.
- Current destinations remain accessible from the map: Home Base, Avatar Studio, Megatrends, Initiative, Lifelong Learning, EST Prep, Shop, Town Hall, and Global Portal.
- Future curriculum districts are represented as locked/future map spaces: Personal Management, Career Building, First Job, Rights & Safety, and Life Event Zone.
- The world-state framework now supports Dormant, Awakening, Growing, and Thriving stages.
- Collision barriers cover buildings, water, and reserved district gates.
- The map still needs visual scale tuning, final building replacements, and richer camera/portal polish before decoration.

## Core Product Idea

Players physically walk between learning areas:

- Student Hub / Home Base
- EST Prep Lab
- Megatrends Centre
- Lifelong Learning Hub
- Initiative Workshop
- Avatar Studio
- Global Shop
- Town Hall / Community Projects
- Global Portal / Interschool Leaderboards

Community is not a module. Community is the world environment itself.

## Curriculum Map Strategy

The world should be designed for the whole Year 12 Careers and Employability program, not only the modules already prototyped.

Recommendation: do not rebuild from scratch every time a curriculum area is added. Instead, create a larger expandable world plan with named districts. The first build can still be a small vertical slice, but the map needs reserved space and route logic for later curriculum additions.

### Proposed World Districts

#### Home Base District

Purpose: identity, profile, progress, class status, evidence, and reflection.

Likely curriculum links:

- student profile
- personal goals
- evidence portfolio
- class progress
- teacher feedback

#### Future Work District

Purpose: nature of work, megatrends, labour market information, growth industries, emerging jobs, and global trends.

Likely curriculum links:

- megatrends
- economic power shifts
- demographic shifts
- impactful technology
- climate change
- emerging and declining jobs
- local, national, and global labour trends
- green industries
- industry growth areas

#### Personal Management District

Purpose: resilience, career adaptability, unexpected life events, personal/professional risk, finance, and handling feedback.

Likely curriculum links:

- resilience
- career adaptability
- unexpected life events
- financial circumstances
- budgeting, saving, investing
- personal and professional risk
- feedback and review processes
- coping with change or unemployment

#### Lifelong Learning District

Purpose: continuing professional development and learning habits.

Likely curriculum links:

- lifelong learning
- identifying personal learning needs
- planning learning opportunities
- participating in learning
- reflecting on learning
- applying and sharing learning

#### Enterprise District

Purpose: initiative, enterprising behaviours, workplace improvement, leadership, and enterprise culture.

Likely curriculum links:

- initiative
- being proactive
- improving work practices
- helping fellow workers
- seeking responsibility
- enterprise culture
- values, vision, practices, innovation, leadership
- continuous improvement

#### Career Building District

Purpose: applying for jobs, resumes, cover letters, selection criteria, interviews, and performance management.

Likely curriculum links:

- job advertisements
- job descriptions
- qualifications
- application deadlines
- online, written, and verbal applications
- resumes
- cover letters
- selection criteria
- SAO, STAR, and CAR responses
- interview preparation
- face-to-face, phone, video, online, panel, individual, and group interviews
- performance management

#### Workplace Rights And Safety District

Purpose: employment law, WHS, equal opportunity, Fair Work, conditions, workplace protocols, grievances, bullying, harassment, and discrimination.

Likely curriculum links:

- Work Health and Safety Act 2020
- Equal Opportunity Act 1984 (WA)
- Fair Work Act 2009
- wages and allowances
- employment types and classifications
- leave entitlements
- hours, breaks, and superannuation
- consultation and dispute resolution
- termination and redundancy
- workplace rights and protocols
- codes of conduct
- appropriate technology use
- grievance procedures
- bullying
- sexual harassment
- discrimination

#### Community Transformation Districts

Purpose: show class impact through visible shared-world upgrades.

Likely curriculum links:

- green futures
- digital access
- fairer starts
- wider horizons
- class votes
- community fund
- interschool/global leaderboard access

## Curriculum Planning Decision

We should not build every district now.

We should reserve the map space now.

That means the base map should have:

- one central plaza
- one strong first playable route
- several locked or under-construction district entrances
- clear expansion roads/bridges/portals
- room for later buildings without moving the first slice

This avoids two bad outcomes:

- building a tiny map that cannot fit the course later
- building a giant empty map before the gameplay is proven

## Order Of Operations

### 1. Lock The World Blueprint

Create the proper town plan before adding more props or extra characters.

The blueprint must define:

- town shape
- main plaza
- roads and footpaths
- grass, gardens, and water
- bridges and natural barriers
- building positions
- building front doors
- community transformation zones
- portal locations
- collision areas
- camera zones
- mini-map markers

Outcome: a map layout that feels believable, walkable, and expandable.

### 2. Define Map Progression States

The map should have visible states based on class progress.

Suggested global states:

- State 0: Dormant / Starting
- State 1: Awakening
- State 2: Growing
- State 3: Thriving

State 0 should feel duller and less active. State 3 should feel full colour, lively, and successful.

### 3. Rebuild The Phaser Base Map

Rebuild the actual Phaser map around the blueprint.

Priorities:

- logical roads
- no random road fragments
- believable paths to every building
- integrated grass and water
- clear walking routes
- sensible building scale
- clear town districts
- space for future props

Buildings 1-5 can remain as placeholders if their final art is being remade.

### 4. Add Collision And Portal Zones

Every building needs:

- collision boundary
- visible front-door portal
- approach trigger zone
- Enter action
- side-panel status

Other blocked areas:

- ponds and rivers
- major scenery
- building footprints
- cliffs, walls, and dense planting if added

### 5. Build The Camera System

The camera is key to immersion.

Camera modes:

- travel view
- closer follow view
- building approach view
- portal entry view
- optional whole-map overview

When approaching a building, the camera should zoom and frame the building with the player lower in view, so it feels like walking toward a destination.

### 6. Improve Character Movement

B01 is the test character. Do not scale to more characters until B01 feels right.

Current B01 art notes:

- Back walk cycle works best.
- Left/right movement works but only has one walk pose per side.
- Front movement currently lacks a proper front walk cycle, so it can look like sliding.
- Jump only has a back-facing pose, so jumping from another direction snaps to back view.
- Dedicated left/right frames are good because they avoid mirroring the badge/watch asymmetry.

Recommended next B01 art requests:

- `walk-front-3q-a`
- `walk-front-3q-b`
- `walk-left-3q-b`
- `walk-right-3q-b`
- optional `jump-front-3q`
- optional `jump-left-3q`
- optional `jump-right-3q`

### 7. Add Environmental Progression Logic

The world should respond to gameplay.

Inputs may include:

- completed modules
- class votes
- student earnings
- assets purchased
- evidence submitted
- teacher approvals
- leaderboard position
- community fund value

Possible visible outputs:

- world colour increases
- lights turn on
- portals activate
- grass becomes richer
- fountains and waterfalls switch on
- buildings upgrade
- NPCs appear
- shop displays unlock
- global/interschool areas open

### 8. Add Props And Ambient Life

Only add props after the base map is correct.

Possible props:

- benches
- lights
- trees
- planters
- banners
- signs
- shop stalls
- bikes
- bins
- noticeboards
- fountains
- NPC students
- hologram markers

Purpose: make the world feel lived-in, not cluttered.

### 9. Connect To Real Gameplay Data

Eventually the map should use real player/class state rather than demo values.

Systems to connect:

- module completion
- EST readiness
- student profile
- class economy
- assets
- shop purchases
- community fund
- community votes
- teacher review/approval
- leaderboards

### 10. Scale The Asset Pipeline

Only scale production after one vertical slice feels good.

Asset batches should follow this order:

- missing B01 movement poses
- final building replacements
- transformation state assets
- portal effects
- props
- ambient NPCs
- additional avatars

## Community Transformation Tracks

### Green Futures

Purpose: climate and sustainability progress.

Suggested stages:

- Stage 0: coal plant / polluted site
- Stage 1: cleanup site
- Stage 2: solar park
- Stage 3: lush waterfall gardens

### Digital Access

Purpose: technology education and inclusion.

Suggested stages:

- Stage 0: locked or limited tech space
- Stage 1: device hub
- Stage 2: open technology learning centre
- Stage 3: future skills campus

### Fairer Starts

Purpose: diversity, belonging, and economic equity.

Suggested stages:

- Stage 0: empty or underused lot
- Stage 1: support desk
- Stage 2: mentor centre
- Stage 3: belonging precinct

### Wider Horizons

Purpose: global opportunity and interschool connection.

Suggested stages:

- Stage 0: closed road / local-only area
- Stage 1: departure board
- Stage 2: airport or transport link
- Stage 3: global exchange hub

## Immediate Next Build Task

Use the curriculum journey map to redesign the Phaser base map layout before adding props.

Current implementation now includes:

- aerial map mode from the `M` key and the Aerial Map button
- automatic return to player-tracking view when the student moves
- doorway portal detection for current buildings
- Enter/action button only unlocking when the student reaches the portal
- a portal prompt at the bottom of the map
- building, water, and reserved-district movement barriers
- mini-map markers for modules, town projects, districts, and player position
- corrected map architecture: Skills School is the place for capability learning, while resilience, adaptability, initiative, communication, teamwork, and problem-solving are earned tools rather than separate buildings
- story events such as earthquakes, relocation, money shocks, discrimination, bullying, underpayment, and workplace incidents are world-state changes, not standalone buildings
- first map-polish pass with narrower, cleaner route drawing
- first prop pass using available production assets: street lights, benches, planters, signs, trees, bike racks, shop display, solar canopy, community banner, and portal rings
- feedback pass from annotated map review: aerial view now fills the playable map area better, future-district roads that looked like disconnected dead ends were removed, route endpoints were moved toward building approaches instead of through building centres, water rendering was softened, small trees were enlarged, and decorative portal-ring images were disabled because they made entrances look disproportionate

Current visual caveat:

- Some oversized circular glow/footprint still appears to be baked into the current building PNGs. This should be handled by replacing or cleaning the building assets rather than by adding more Phaser effects.

This should include:

- the main year-long journey road
- Skills School as a reusable capability hub
- district space for all major curriculum areas
- planned road and path network
- integrated ponds/water
- logical building locations
- entrance-facing portals
- collision map
- camera approach zones
- mini-map marker updates
- support for progression states

## Decisions To Make

- Should the map be one large town, or several connected districts?
- Should the global portal be visible from the start or unlock later?
- Should the dormant world be grey/dull, or simply less lit and less populated?
- Should community transformation zones sit around the main town, or be reached via paths from the plaza?
- Should students see class progress as one shared world state, or personal progress layered on top?

## Current Recommendation

Build one strong vertical slice first:

Student Hub plaza -> EST Prep Lab -> Green Futures transformation zone.

This gives us:

- one home base
- one learning module
- one community transformation
- one portal interaction pattern
- one camera approach pattern
- one progression example

Once that slice feels right, scale the pattern across the rest of the town.
