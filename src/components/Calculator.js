import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./Calculator.css";

const GradeCalculator = () => {
  const [modules, setModules] = useState([]);
  const [moduleYears, setModuleYears] = useState([]);
  const [moduleCredits, setModuleCredits] = useState([]);
  const [yearCredits, setYearCredits] = useState([60, 60, 60, 60]);
  const [yearWeights, setYearWeights] = useState([[0], [10], [20], [70]]);
  const [gradeData, setGradeData] = useState([]);
  const [finalGrade, setFinalGrade] = useState(0);

  useEffect(() => {
    generateRandomModules();
  }, []);

  const generateRandomModules = () => {
    const courseNames = [
      "Introduction to Computer Science",
      "Data Structures",
      "Algorithms",
      "Database Systems",
      "Operating Systems",
      "Computer Networks",
      "Web Development",
      "Software Engineering",
      "Artificial Intelligence",
      "Machine Learning",
      "Cybersecurity",
      "Computer Graphics",
    ];

    const getRandomCourseName = () => courseNames[Math.floor(Math.random() * courseNames.length)];
    const getRandomGrade = () => Math.floor(Math.random() * 101);

    const modulesPerYear = 12;
    const creditsPerModule = 5;
    const years = [1, 2, 3, 4];

    let generatedModules = [],
      generatedModuleYears = [],
      generatedModuleCredits = [],
      generatedGradeData = [];

    years.forEach((year) => {
      for (let i = 0; i < modulesPerYear; i++) {
        generatedModules.push(getRandomCourseName());
        generatedModuleYears.push(year);
        generatedModuleCredits.push(creditsPerModule);
        generatedGradeData.push(getRandomGrade());
      }
    });

    setModules(generatedModules);
    setModuleYears(generatedModuleYears);
    setModuleCredits(generatedModuleCredits);
    setGradeData(generatedGradeData);
  };

  const calculateFinalGrade = () => {
    let totalCredits = yearCredits.reduce((sum, credits) => sum + credits, 0);
    let weightedGrades = 0;

    yearCredits.forEach((credits, index) => {
      let yearGrade = calculateYearGrade(index);
      let weight = (yearWeights[index]?.[0] || 0) / 100;
      weightedGrades += yearGrade * weight;
    });

    setFinalGrade(totalCredits > 0 ? weightedGrades.toFixed(2) : 0);
  };

  const calculateYearGrade = (yearIndex) => {
    let yearModules = modules.map((_, index) => moduleYears[index] === yearIndex + 1);
    let yearGrades = gradeData.filter((_, index) => moduleYears[index] === yearIndex + 1);
    let yearModuleCredits = moduleCredits.filter((_, index) => moduleYears[index] === yearIndex + 1);

    let totalWeightedGrade = yearGrades.reduce((sum, grade, index) => sum + grade * yearModuleCredits[index], 0);
    let totalCredits = yearModuleCredits.reduce((sum, credit) => sum + credit, 0);

    return totalCredits > 0 ? totalWeightedGrade / totalCredits : 0;
  };

  return (
    <Container
      className="rainbow-columns"
      style={{ width: "100%", maxWidth: "100%", marginLeft: "0px", marginRight: "0px" }}
    >
      <div id="results">
        <h1
          style={{
            border: "4px solid black",
            borderRadius: "5px",
            backgroundColor: "#8ac926",
            margin: "5px",
            padding: "5px",
            color: "white",
            fontSize: "35px",
            marginTop: "0px",
            marginBottom: "0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Grade Calculator
        </h1>
        <Button
          variant="primary"
          style={{
            border: "4px solid black",
            borderRadius: "5px",

            fontSize: "35px",
          }}
          onClick={calculateFinalGrade}
        >
          Calculate Final Grade
        </Button>
        <h2
          style={{
            border: "4px solid black",
            borderRadius: "5px",
            backgroundColor: "#8ac926",
            margin: "5px",
            padding: "5px",
            fontSize: "35px",
            marginTop: "0px",
            marginBottom: "0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Final Grade: {finalGrade}%
        </h2>
      </div>
      <Row style={{ margin: "0px" }}>
        {[0, 1, 2, 3, 4].map((yearIndex) => (
          <Col
            className="col"
            xs={yearIndex === 4 ? undefined : 12}
            md={yearIndex === 4 ? undefined : 2}
            key={yearIndex}
          >
            {yearIndex === 4 ? (
              <h2
                style={{
                  border: "4px solid black",
                  borderRadius: "5px",
                  backgroundColor: "white",
                  margin: "5px",
                  padding: "5px",
                }}
              >
                Grade per Year
              </h2>
            ) : (
              <h2
                style={{
                  border: "4px solid black",
                  borderRadius: "5px",
                  backgroundColor: "white",
                  margin: "5px",
                  padding: "5px",
                }}
              >
                Year {yearIndex + 1}
              </h2>
            )}
            {yearIndex === 4 ? (
              <>
                {[0, 1, 2, 3].map((year) => (
                  <Card key={year} style={{ padding: "20px" }}>
                    Year {year + 1}:<br />
                    Percentage: {calculateYearGrade(year)}%
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Form.Group>
                  <Form.Label>Year Weight (%)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Year Weight (%)"
                    value={yearWeights[yearIndex]?.[0] || ""}
                    onChange={(event) => {
                      let updatedWeights = [...yearWeights];
                      updatedWeights[yearIndex] = [parseFloat(event.target.value) || 0];
                      setYearWeights(updatedWeights);
                    }}
                  />
                </Form.Group>
                <br />
                {modules.map(
                  (module, index) =>
                    moduleYears[index] === yearIndex + 1 && (
                      <Card style={{ padding: "20px" }} key={index}>
                        <Form.Group>
                          <Form.Label>Module Name</Form.Label>
                          <Form.Control type="text" value={module} readOnly />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Grade (%)</Form.Label>
                          <Form.Control type="number" value={gradeData[index] || ""} readOnly />
                        </Form.Group>
                      </Card>
                    )
                )}
              </>
            )}
          </Col>
        ))}
      </Row>
      <br />
    </Container>
  );
};

export default GradeCalculator;
