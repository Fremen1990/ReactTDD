const Input = ({ id, help, onChange, label, placeholder }) => {
  let inputClass = "form-control";
  if (help) {
    inputClass += " is-invalid";
  }

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        className="inputClass"
        id={id}
        onChange={onChange}
        placeholder={placeholder}
      />
      <span className="invalid-feedback">{help}</span>
    </div>
  );
};

export default Input;
