import * as React from 'react';
import { connect } from 'react-redux';
import { State } from 'gui/store/ducks';
import { selectEntry as selectEntryAction } from 'gui/store/ducks/library';
import {
  LibraryList
} from 'gui/components/Library/libraryElements';
import {
  Container,
  Item,
  Title,
  Details,
  Detail,
  Counter,
  Progress
} from './listElements';

interface ListOwnProps {}

interface ListMapStateProps {
  entries: Map<string, Entry>
}

interface ListMapDispatchProps {
  selectEntry: (entryId: string) => void
}

class List extends React.Component<ListOwnProps & ListMapStateProps & ListMapDispatchProps, {}> {
  render() {
    return (
      <LibraryList>
        <Container>

          <Item>
            <Title>
              I am entry #1
            </Title>
            <Details>
              <Detail>
                1280&times;720
              </Detail>
            </Details>
            <Counter>
              5/12
            </Counter>
            <Progress width={49.5}/>
          </Item>

          <Item>
            <Title>
              I am entry #2
            </Title>
            <Details>
              <Detail>
                1920&times;1080
              </Detail>
            </Details>
            <Counter>
              2/6
            </Counter>
            <Progress width={33.3}/>
          </Item>

        </Container>
      </LibraryList>
    );
  }
}

export default connect<ListMapStateProps, ListMapDispatchProps, ListOwnProps>(
  (state: State) => ({
    entries: state.library.entries
  }),
  dispatch => ({
    selectEntry: (entryId: string) => dispatch(selectEntryAction(entryId))
  })
)(List);
