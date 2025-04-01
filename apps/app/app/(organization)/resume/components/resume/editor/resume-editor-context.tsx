import type { Resume } from '@/types';
import { type Dispatch, createContext, useContext } from 'react';

interface ResumeState {
  resume: Omit<Resume, 'rulesPrompt' | 'aiProvider' | 'aiModel' | 'aiApiKey'>;
  isSaving: boolean;
  isDeleting: boolean;
  hasUnsavedChanges: boolean;
}

type ResumeAction =
  | {
      type: 'UPDATE_FIELD';
      field: keyof Omit<
        Resume,
        'rulesPrompt' | 'aiProvider' | 'aiModel' | 'aiApiKey'
      >;
      value: Resume[keyof Omit<
        Resume,
        'rulesPrompt' | 'aiProvider' | 'aiModel' | 'aiApiKey'
      >];
    }
  | { type: 'SET_SAVING'; value: boolean }
  | { type: 'SET_DELETING'; value: boolean }
  | { type: 'SET_HAS_CHANGES'; value: boolean };

const ResumeContext = createContext<{
  state: ResumeState;
  dispatch: Dispatch<ResumeAction>;
} | null>(null);

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      // biome-ignore lint/style/useSingleCaseStatement: <explanation>
      // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
      const newState = {
        ...state,
        resume: {
          ...state.resume,
          [action.field]: action.value,
        },
      };
      return newState;

    case 'SET_SAVING':
      // console.log('Resume Editor Context - Saving State:', action.value);
      return { ...state, isSaving: action.value };
    case 'SET_DELETING':
      // console.log('Resume Editor Context - Deleting State:', action.value);
      return { ...state, isDeleting: action.value };
    case 'SET_HAS_CHANGES':
      // console.log('Resume Editor Context - Unsaved Changes:', action.value);
      return { ...state, hasUnsavedChanges: action.value };
    default:
      return state;
  }
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
}

export { ResumeContext, resumeReducer };
