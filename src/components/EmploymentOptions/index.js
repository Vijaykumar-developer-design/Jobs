import "./index.css";

const Employment = (props) => {
  const renderTypeOfEmployment = () => {
    const { employmentTypesList, changeEmploymentType } = props;
    const changeEmployment = (event) => {
      const values = event.target.value;
      const checkStatus = event.target.checked;
      changeEmploymentType({ values, checkStatus });
    };
    return (
      <div className="em-types">
        <hr />
        <h1 className="em-type">Type of Employment</h1>
        <ul className="ul-list">
          {employmentTypesList.map((each) => (
            <li
              className="list-ele"
              onChange={changeEmployment}
              key={each.employmentTypeId}
            >
              <input
                value={each.employmentTypeId}
                className="type-input"
                type="checkbox"
                id={each.employmentTypeId}
              />
              <label htmlFor={each.employmentTypeId}>{each.label}</label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSalaryRange = () => {
    const { salaryRangesList, changeSalaryRange } = props;
    const changeSalary = (event) => {
      changeSalaryRange(event.target.id);
    };
    return (
      <div className="em-types">
        <hr />
        <h1 className="em-type">Salary Range</h1>
        <ul className="ul-list">
          {salaryRangesList.map((each) => (
            <li className="list-ele" key={each.salaryRangeId}>
              <input
                onChange={changeSalary}
                id={each.salaryRangeId}
                className="type-input"
                type="radio"
                name="salary"
                value={each.salaryRangeId}
              />
              <label htmlFor={each.salaryRangeId}>{each.label}</label>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div className="em-container">
      {renderTypeOfEmployment()}
      {renderSalaryRange()}
    </div>
  );
};
export default Employment;
