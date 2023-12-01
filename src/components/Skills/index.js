import "./index.css";

const Skill = (props) => {
  const { skillList } = props;
  const { skillName, skillImgUrl } = skillList;

  return (
    <li key={skillName} className="skills-div">
      <img className="skill-img" src={skillImgUrl} alt={skillName} />
      <h1 className="skills-head">{skillName}</h1>
    </li>
  );
};
export default Skill;
