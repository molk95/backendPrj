import React, { useState } from "react";
import { connect } from "react-redux";
import { addPhoto } from "../../actions/photo";

const PhotoForm = ({ addPhoto }) => {
  const [formData, setFormData] = useState({
    text: "",
    keyword: "",
    image: ""
  });
  const { text, keyword, image } = formData;
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Add a Photo...</h3>
      </div>
      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault();
          addPhoto({ text, keyword, image });
        }}
      >
        <input
          type="text"
          name="text"
          placeholder="type title"
          value={text}
          onChange={e => onChange(e)}
          required
        />
        <input
          type="text"
          name="keyword"
          placeholder="type keyword"
          value={keyword}
          onChange={e => onChange(e)}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="copy Image URL"
          value={image}
          onChange={e => onChange(e)}
          required
        />
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

export default connect(null, { addPhoto })(PhotoForm);
