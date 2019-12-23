import React from "react";
import styled from "styled-components";
import SearchBar from "../../components/SearchBar";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default class extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <SearchBar
        // static navigat... 이 생성되는 시점에는 state, onChange가 생성되 있지 않아서 오류발생
        value={this.state.term}
        onChange={this.onChange}
        onSubmit={() => null}
      />
    )
  });

  state = {
    term: ""
  };

  onChange = text => {
    this.setState({ term: text });
  };

  render() {
    return (
      <View>
        <Text>Search</Text>
      </View>
    );
  }
}
