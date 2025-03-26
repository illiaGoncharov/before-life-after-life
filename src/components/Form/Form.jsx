import React from "react";

function Form() {
  return (
    <div>
      <h2>Form [After Life]</h2>
      <form>
        <label>
          [1]
          <input type="text" name="purpose" />
        </label>
        <br />
        <label>
          [2]
          <input type="text" name="expectations" />
        </label>
        <br />
        <button type="submit">[NEXT]</button>
      </form>
    </div>
  );
}

export default Form;
