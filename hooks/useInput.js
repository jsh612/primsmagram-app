import React, { useState } from "react";

const useInput = initValue => {
  const [value, setValue] = useState(initValue);
  const onChange = text => {
    //text --> 일반적인 event.target.value 와 같은 값
    setValue(text);
  };
  return { value, onChange, setValue }; // setValue로 value 값 변경시 해당 페이지 리랜더 된다.
};

export default useInput;
