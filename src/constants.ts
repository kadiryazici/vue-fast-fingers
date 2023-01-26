import { markRaw } from 'vue'

import HistoryIcon from '~icons/ic/twotone-history'
import ResetIcon from '~icons/ic/baseline-restart-alt'
import CleanIcon from '~icons/ic/baseline-cleaning-services'

export enum WordStatus {
  Wrong,
  Correct,
  None,
}

export enum ColorCSSVars {
  Accent = 'var(--accent)',
  Black = 'var(--black)',
  White = 'var(--white)',
  Correct = 'var(--correct)',
  Wrong = 'var(--wrong)',
}

export const IconComponents = {
  History: markRaw(HistoryIcon),
  Reset: markRaw(ResetIcon),
  Clean: markRaw(CleanIcon),
}
