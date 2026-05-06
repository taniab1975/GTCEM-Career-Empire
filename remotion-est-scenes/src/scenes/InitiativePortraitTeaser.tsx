import {loadFont as loadBungeeFont} from "@remotion/google-fonts/Bungee";
import {loadFont as loadOutfitFont} from "@remotion/google-fonts/Outfit";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import {estAssets} from "../assets";

const {fontFamily: displayFont} = loadBungeeFont();
const {fontFamily: bodyFont} = loadOutfitFont();

const enter = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number
) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const arcadeText = (
  text: string,
  color: string,
  fontSize: number,
  shadowColor: string
) => (
  <div
    style={{
      fontFamily: displayFont,
      fontSize,
      lineHeight: 0.92,
      color,
      WebkitTextStroke: "10px #07375e",
      paintOrder: "stroke fill",
      textShadow: `0 10px 0 ${shadowColor}, 0 22px 26px rgba(0,0,0,0.28)`,
      letterSpacing: 0
    }}
  >
    {text}
  </div>
);

const initiativeWays = [
  "Be proactive",
  "Identify ways to improve work practices",
  "Vocalise your opinions",
  "Help fellow workers",
  "Seek extra responsibilities"
];

const phaseOpacity = (frame: number, inStart: number, outStart?: number) => {
  const fadeIn = enter(frame, inStart, 10, 0, 1);
  const fadeOut =
    outStart === undefined ? 1 : 1 - enter(frame, outStart, 8, 0, 1);

  return fadeIn * fadeOut;
};

export const InitiativePortraitTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const totalFrames = Math.max(1, durationInFrames - 1);
  const progress = frame / totalFrames;

  const bgScale = interpolate(frame, [0, totalFrames], [1.02, 1.08], {
    extrapolateRight: "clamp"
  });
  const titleY = enter(frame, 8, 28, -92, 0);
  const titleOpacity = enter(frame, 8, 20, 0, 1);
  const screenOpacity = enter(frame, 40, 20, 0, 1);
  const screenY = enter(frame, 40, 24, 70, 0);
  const skillOpacity = phaseOpacity(frame, 54, 144);
  const howOpacity = phaseOpacity(frame, 156);
  const crestPop = spring({
    fps,
    frame: frame - 150,
    config: {damping: 14, stiffness: 110}
  });
  const shimmer = interpolate(frame % 80, [0, 40, 80], [-120, 180, -120]);
  const fadeOut = interpolate(progress, [0.9, 1], [1, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: bodyFont,
        color: "white",
        background: "#8cd9f3",
        overflow: "hidden",
        opacity: fadeOut
      }}
    >
      <AbsoluteFill style={{transform: `scale(${bgScale})`}}>
        <Img
          src={estAssets.images.frassatiWide}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "0% 50%",
            filter: "saturate(1.12) contrast(1.04) brightness(1.03)"
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,39,74,0.2) 0%, rgba(3,39,74,0.04) 38%, rgba(3,39,74,0.62) 100%)"
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 70% 19%, rgba(255,220,60,0.35) 0%, rgba(255,220,60,0) 24%), radial-gradient(circle at 22% 82%, rgba(42,168,255,0.32) 0%, rgba(42,168,255,0) 30%)"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 78,
          left: 56,
          right: 56,
          display: "grid",
          justifyItems: "end",
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity
        }}
      >
        <div style={{position: "relative", textAlign: "right"}}>
          {arcadeText("INITIATIVE", "#ffdf31", 76, "#159ee1")}
          {arcadeText("SKILLS", "#25bdf4", 124, "#ff5544")}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: `${shimmer}px`,
              width: 58,
              height: 242,
              borderRadius: 999,
              background: "rgba(255,255,255,0.48)",
              filter: "blur(10px)",
              transform: "rotate(18deg)",
              mixBlendMode: "screen",
              opacity: 0.45
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 840,
          bottom: 326,
          padding: "30px 36px",
          borderRadius: 38,
          background:
            "linear-gradient(135deg, rgba(4, 28, 62, 0.84), rgba(2, 64, 86, 0.78))",
          border: "5px solid rgba(255,255,255,0.58)",
          boxShadow: "0 26px 54px rgba(0,0,0,0.28), inset 0 0 0 2px rgba(170,255,214,0.2)",
          backdropFilter: "blur(12px)",
          transform: `translateY(${screenY}px)`,
          opacity: screenOpacity,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 12% 16%, rgba(255,223,49,0.2), transparent 26%), radial-gradient(circle at 84% 82%, rgba(40,201,245,0.22), transparent 28%)"
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 30,
            opacity: skillOpacity,
            transform: `translateX(${interpolate(skillOpacity, [0, 1], [-34, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 30,
              lineHeight: 1,
              color: "#aaffd6",
              WebkitTextStroke: "3px #07375e",
              paintOrder: "stroke fill",
              textShadow: "0 5px 0 #159ee1",
              marginBottom: 12
            }}
          >
            SKILL FOCUS
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 45,
              lineHeight: 0.98,
              color: "#ffffff",
              WebkitTextStroke: "4px #07375e",
              paintOrder: "stroke fill",
              textShadow: "0 7px 0 rgba(255,85,68,0.8)",
              marginBottom: 18
            }}
          >
            Initiative starts before someone tells you
          </div>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 27,
              lineHeight: 1.2,
              fontWeight: 900,
              color: "rgba(255,255,255,0.94)",
              maxWidth: 880,
              marginBottom: 22,
              textShadow: "0 3px 0 rgba(7,55,94,0.72)"
            }}
          >
            A worker spots a problem early and acts straight away. Initiative means thinking
            ahead, solving problems, and improving the situation before it becomes bigger.
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.08fr 0.92fr",
              gap: 18,
              alignItems: "stretch"
            }}
          >
            <div
              style={{
                minHeight: 160,
                borderRadius: 26,
                background: "rgba(19, 86, 83, 0.74)",
                border: "3px solid rgba(170,255,214,0.5)",
                display: "grid",
                gridTemplateColumns: "152px 1fr",
                alignItems: "center",
                gap: 22,
                padding: "20px 24px"
              }}
            >
              <Img
                src={estAssets.logos.problemSolving}
                style={{
                  width: 138,
                  height: 138,
                  objectFit: "contain",
                  filter: "drop-shadow(0 8px 0 rgba(7,55,94,0.34))"
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: displayFont,
                    fontSize: 23,
                    color: "#aaffd6",
                    WebkitTextStroke: "2px #07375e",
                    paintOrder: "stroke fill",
                    marginBottom: 8
                  }}
                >
                  PARENT SKILL
                </div>
                <div
                  style={{
                    fontFamily: displayFont,
                    fontSize: 38,
                    lineHeight: 1,
                    color: "#ffffff",
                    WebkitTextStroke: "3px #07375e",
                    paintOrder: "stroke fill",
                    textShadow: "0 5px 0 rgba(255,85,68,0.76)"
                  }}
                >
                  Problem-Solving
                </div>
              </div>
            </div>
            <div style={{display: "grid", gap: 16}}>
              {[
                {
                  label: "Subskill: Generate Solutions",
                  icon: estAssets.subskills.problemSolving.generateSolutions
                },
                {
                  label: "Subskill: Decision-making Models",
                  icon: estAssets.subskills.problemSolving.decisionMakingModels
                }
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    borderRadius: 24,
                    background: "rgba(19, 86, 83, 0.74)",
                    border: "3px solid rgba(170,255,214,0.5)",
                    display: "grid",
                    gridTemplateColumns: "100px 1fr",
                    alignItems: "center",
                    gap: 14,
                    padding: "15px 18px"
                  }}
                >
                  <Img
                    src={item.icon}
                    style={{
                      width: 84,
                      height: 84,
                      objectFit: "contain",
                      filter: "drop-shadow(0 5px 0 rgba(7,55,94,0.34))"
                    }}
                  />
                  <div
                    style={{
                      fontFamily: displayFont,
                      fontSize: 25,
                      lineHeight: 1.05,
                      color: "#ffffff",
                      WebkitTextStroke: "2px #07375e",
                      paintOrder: "stroke fill"
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 30,
            opacity: howOpacity,
            transform: `translateX(${interpolate(howOpacity, [0, 1], [42, 0])}px)`
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 34,
              lineHeight: 1,
              color: "#aaffd6",
              WebkitTextStroke: "3px #07375e",
              paintOrder: "stroke fill",
              textShadow: "0 5px 0 #159ee1",
              marginBottom: 14
            }}
          >
            HOW TO SHOW INITIATIVE
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              alignItems: "stretch",
              alignContent: "space-between",
              height: 584
            }}
          >
            {initiativeWays.map((way, index) => (
            <div
              key={way}
              style={{
                display: "grid",
                gridTemplateColumns: "34px 1fr",
                alignItems: "center",
                gap: 14,
                minHeight: index === 1 ? 136 : 116,
                padding: "20px 22px",
                borderRadius: 24,
                background:
                  index % 2 === 0
                    ? "rgba(19, 86, 83, 0.76)"
                    : "rgba(4, 47, 85, 0.78)",
                border: "3px solid rgba(255,255,255,0.52)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
                opacity: enter(frame, 172 + index * 9, 14, 0, 1),
                transform: `translateY(${enter(frame, 172 + index * 9, 18, 28, 0)}px)`,
                gridColumn: index === 4 ? "1 / span 2" : undefined
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  background: index % 2 === 0 ? "#ffdf31" : "#28c9f5",
                  border: "3px solid #07375e",
                  boxShadow: "0 4px 0 rgba(7,55,94,0.9)"
                }}
              />
              <div
                style={{
                  fontFamily: bodyFont,
                  fontSize: 30,
                  lineHeight: 1.06,
                  fontWeight: 1000,
                  color: "#ffffff",
                  textShadow: "0 4px 0 rgba(7,55,94,0.78)"
                }}
              >
                {way}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 62,
          right: 250,
          bottom: 208,
          padding: "20px 28px",
          borderRadius: 28,
          background: "rgba(4, 47, 85, 0.72)",
          border: "4px solid rgba(255,255,255,0.62)",
          boxShadow: "0 22px 46px rgba(0,0,0,0.24)",
          backdropFilter: "blur(12px)",
          transform: `translateY(${enter(frame, 92, 24, 44, 0)}px)`,
          opacity: enter(frame, 92, 22, 0, 1)
        }}
      >
        <div
          style={{
            fontSize: 26,
            lineHeight: 1,
            fontWeight: 1000,
            color: "#aaffd6",
            textTransform: "uppercase",
            textShadow: "0 4px 0 #07375e"
          }}
        >
          See a problem?
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 34,
            lineHeight: 1,
            fontWeight: 1000,
            color: "#ffffff",
            textShadow: "0 5px 0 rgba(7,55,94,0.78)"
          }}
        >
          Take the first smart step.
        </div>
      </div>

      <Img
        src={estAssets.images.eccLogo}
        style={{
          position: "absolute",
          right: 62,
          bottom: 214,
          width: 116,
          height: 138,
          objectFit: "contain",
          transform: `scale(${0.72 + crestPop * 0.28})`,
          opacity: enter(frame, 154, 20, 0, 1),
          filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.28))"
        }}
      />
    </AbsoluteFill>
  );
};
