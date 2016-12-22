import { Action as BaseAction } from 'redux';

export interface State {
  entries: Map<string, Entry>,
  currentEntry?: string
}
const initialState: State = {
  entries: new Map<string, Entry>(),
  currentEntry: null
};

initialState.entries.set('123', {
    id: '123',
    path: 'D:\\anime',
    title: 'Test entry yaya',
    width: 1280,
    height: 720,
    bitDepth: '8',
    episodes: new Map(),
    subtitles: new Map(),
    voiceOvers: new Map(),
    defaultSubtitles: '',
    defaultVoiceOver: ''
});

type SelectEntryAction = BaseAction & { entryId: string };
const SELECT_ENTRY = 'bakaru/library/entry/select';
function doSelectEntry(state: State, { entryId }: SelectEntryAction): State {
  return {
    ...state,
    currentEntry: entryId
  };
}

type Action =
  SelectEntryAction
  ;
export default function library(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SELECT_ENTRY: return doSelectEntry(state, action);

    default: return state;
  }
}

/**
 * Select entry
 *
 * @param entryId
 * @returns {{type: string, entryId: string}}
 */
export function selectEntry(entryId: string): SelectEntryAction {
  return {
    type: SELECT_ENTRY,
    entryId
  };
}
