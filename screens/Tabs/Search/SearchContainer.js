import React from "react";
import SearchBar from "../../../components/SearchBar";
import SearchPresenter from "./SearchPresenter";

// header-title에서 검색내용 입력시, 화면에 검색 내용 보여주기
export default class extends React.Component {
  // 각 screen 마다 navigationOptions 설정을 할 수 있다.
  // https://reactnavigation.org/docs/en/headers.html
  static navigationOptions = ({ navigation }) => ({
    //we need class components so we can use 'static'!
    //따라서 함수 컴포넌트를 사용하지 않고, 클래스 컴포넌트를 사용하는 것이다.
    headerTitle: (
      <SearchBar
        value={navigation.getParam("term", "")}
        onChange={navigation.getParam("onChange", () => null)}
        onSubmit={navigation.getParam("onSubmit", () => null)}
      />
    )
  });

  constructor(props) {
    //constructor는 이 클래스가 처음 만들어질 떄 가장 먼저 실행
    // 따라서 이를 이용해여 , 정적 메소드(navigationOptions)에서 해당 클래스내의 필요값을 가져 올 수 있다.
    super(props);
    const { navigation } = props;
    this.state = {
      term: "",
      shouldFetch: false
    };
    navigation.setParams({
      term: this.state.term,
      onChange: this.onChange,
      onSubmit: this.onSubmit
    });
  }

  onChange = text => {
    const { navigation } = this.props;
    this.setState({ term: text, shouldFetch: false });
    navigation.setParams({
      term: text
    });
  };

  onSubmit = () => {
    this.setState({ shouldFetch: true });
  };

  render() {
    const { term, shouldFetch } = this.state;
    return <SearchPresenter term={term} shouldFetch={shouldFetch} />;
  }
}
