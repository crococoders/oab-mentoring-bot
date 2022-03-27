import { Context, Scenes } from 'telegraf';
import Mentor from './mentor';

type ExtendedContextData = {
  mentorsPage: number;
  mentors: Mentor[];
};

interface ExtendedContext extends Context {
  extendedContextData: ExtendedContextData;
  // declare scene type
  scene: Scenes.SceneContextScene<ExtendedContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<ExtendedContext>;
}

export { ExtendedContext };
