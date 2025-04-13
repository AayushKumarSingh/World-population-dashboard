const MadeByCard = () => {
  const cardStyle = {
    width: "240px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    backgroundColor: "#fff",
  };

  const listStyle = {
    listStyleType: "none",
    padding: 0,
    marginTop: "8px",
  };

  const listItemStyle = {
    color: "#444",
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "20px", fontWeight: "600", align: "left" }}>Made by</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}>Aayush kumar Singh</li>
      </ul>
    </div>
  );
};

export default MadeByCard;