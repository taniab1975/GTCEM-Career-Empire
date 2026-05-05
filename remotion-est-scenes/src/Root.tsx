import React from "react";
import {Composition} from "remotion";
import {CommunicationExplainer} from "./scenes/CommunicationExplainer";
import {CriticalThinkingExplainer} from "./scenes/CriticalThinkingExplainer";
import {DigitalLiteracyExplainer} from "./scenes/DigitalLiteracyExplainer";
import {ESTLabSystemsExplainer} from "./scenes/ESTLabSystemsExplainer";
import {InitiativePortraitTeaser} from "./scenes/InitiativePortraitTeaser";
import {InitiativeScenario} from "./scenes/InitiativeScenario";
import {OverseasOpportunityScenario} from "./scenes/OverseasOpportunityScenario";
import {ProblemSolvingExplainer} from "./scenes/ProblemSolvingExplainer";
import {TeamworkExplainer} from "./scenes/TeamworkExplainer";
import {TimeManagementExplainer} from "./scenes/TimeManagementExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ESTLabSystemsExplainer"
        component={ESTLabSystemsExplainer}
        durationInFrames={1350}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="CommunicationExplainer"
        component={CommunicationExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="DigitalLiteracyExplainer"
        component={DigitalLiteracyExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TeamworkExplainer"
        component={TeamworkExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TimeManagementExplainer"
        component={TimeManagementExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="CriticalThinkingExplainer"
        component={CriticalThinkingExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ProblemSolvingExplainer"
        component={ProblemSolvingExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="InitiativeScenario"
        component={InitiativeScenario}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="InitiativePortraitTeaser"
        component={InitiativePortraitTeaser}
        durationInFrames={135}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OverseasOpportunityScenario"
        component={OverseasOpportunityScenario}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
