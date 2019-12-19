import React, { useState } from "react";

const useInput = initValue => {
  const [value, setValue] = useState(initValue);
  const onChange = text => {
    //text --> 일반적인 event.target.value 와 같은 값
    setValue(text);
  };
  return { value, onChange };
};

export default useInput;
