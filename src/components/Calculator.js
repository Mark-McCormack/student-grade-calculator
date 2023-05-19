import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./Calculator.css";

const GradeCalculator = () => {
  const [modules, setModules] = useState([]);
  const [moduleYears, setModuleYears] = useState([]);
  const [moduleCredits, setModuleCredits] = useState([]);
  const [yearCredits, setYearCredits] = useState([60, 60, 60, 60]); // Default yearly credits
  const [yearWeights, setYearWeights] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [finalGrade, setFinalGrade] = useState(0);

  useEffect(() => {
    let initialYearWeights = [[0], [10], [20], [70]]; // Single weight box for each year
    setYearWeights(initialYearWeights);

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

    const getRandomCourseName = () => {
      return courseNames[Math.floor(Math.random() * courseNames.length)];
    };

    const getRandomGrade = () => {
      return 100;
    };

    const modulesPerYear = 12;
    const creditsPerModule = 5;
    const years = [1, 2, 3, 4];

    const generatedModules = [];
    const generatedModuleYears = [];
    const generatedModuleCredits = [];
    const generatedGradeData = [];

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

  const handleModuleChange = (index, event) => {
    const updatedModules = [...modules];
    updatedModules[index] = event.target.value;
    setModules(updatedModules);
  };

  const handleYearChange = (index, event) => {
    const updatedYears = [...moduleYears];
    updatedYears[index] = parseInt(event.target.value);
    setModuleYears(updatedYears);
  };

  const handleGradeChange = (index, event) => {
    const updatedGrades = [...gradeData];
    updatedGrades[index] = parseFloat(event.target.value);
    setGradeData(updatedGrades);
  };

  const handleCreditsChange = (index, event) => {
    const updatedCredits = [...moduleCredits];
    updatedCredits[index] = parseInt(event.target.value);
    setModuleCredits(updatedCredits);
  };

  const handleYearCreditsChange = (yearIndex, event) => {
    const updatedCredits = [...yearCredits];
    updatedCredits[yearIndex] = parseInt(event.target.value);
    setYearCredits(updatedCredits);
  };

  const handleYearWeightChange = (yearIndex, event) => {
    const updatedWeights = [...yearWeights];
    updatedWeights[yearIndex] = [parseFloat(event.target.value)];
    setYearWeights(updatedWeights);
  };

  /**
   * Calculates the final grade based on the module grades and credits.
   * Takes into account the weights assigned to each year.
   */
  const calculateFinalGrade = () => {
    let totalCredits = 0;
    let weightedGrades = 0;

    // Calculate the total credits and weighted grades for each year
    yearCredits.forEach((credits, index) => {
      totalCredits += credits;
      const yearGrade = calculateYearGrade(index);
      weightedGrades += yearGrade * (yearWeights[index] / 100);

      console.log("Weighting for Year " + (index + 1) + ": " + yearWeights[index] / 100);
      console.log("Weighted Grade for Year " + (index + 1) + ": " + yearGrade * (yearWeights[index] / 100));
      console.log("Total Credits for Year " + (index + 1) + ": " + weightedGrades);
    });

    // Calculate the final grade based on the weighted grades and total credits
    if (totalCredits === 0) {
      setFinalGrade(0); // Set the final grade to 0 if no credits are earned
    } else {
      const finalGrade = weightedGrades;
      setFinalGrade(finalGrade.toFixed(2)); // Set the final grade with two decimal places
    }
  };

  const calculateYearGrade = (yearIndex) => {
    // Module Name
    const yearModules = modules.filter((_, index) => moduleYears[index] === yearIndex + 1);

    // Module Grade
    const yearGrades = gradeData.filter((_, index) => moduleYears[index] === yearIndex + 1);

    // Module Credits
    const weights = yearWeights[yearIndex];

    let totalWeightedGrade = 0;
    let totalWeight = 0;

    // Calculate the total weighted grade and total weight for the modules in the year
    yearGrades.forEach((grade, index) => {
      const weight = weights[0] || 0; // Use the first weight if available, otherwise default

      totalWeightedGrade += grade * moduleCredits[index]; // Multiply by module credits

      totalWeight += moduleCredits[index]; // Sum up the module credits
    });

    // Calculate the year grade based on the total weighted grade and total weight
    if (totalWeight === 0) {
      return 0; // Return 0 if no weight is assigned
    } else {
      const yearWeight = yearWeights[yearIndex]?.[0] || 0; // Get the year weight
      return totalWeightedGrade / totalWeight; // Multiply by year weight and divide by 5
    }
  };

  const addModule = (yearIndex) => {
    setModules([...modules, ""]);
    setModuleYears([...moduleYears, yearIndex + 1]);
    setModuleCredits([...moduleCredits, 0]);
    setGradeData([...gradeData, 0]);
  };

  const removeModule = (index) => {
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);

    const updatedYears = [...moduleYears];
    updatedYears.splice(index, 1);
    setModuleYears(updatedYears);

    const updatedCredits = [...moduleCredits];
    updatedCredits.splice(index, 1);
    setModuleCredits(updatedCredits);

    const updatedGrades = [...gradeData];
    updatedGrades.splice(index, 1);
    setGradeData(updatedGrades);
  };

  return (
    <Container className="rainbow-columns">
      <h1>Grade Calculator</h1>
      <Row>
        {[0, 1, 2, 3, 4].map((yearIndex) => (
          <Col key={yearIndex}>
            {yearIndex === 4 ? <h2>Final Grade</h2> : <h2>Year {yearIndex + 1}</h2>}
            {yearIndex === 4 ? (
              <>
                {[0, 1, 2, 3].map((year) => (
                  <Card key={year} style={{ padding: "20px" }}>
                    Year {year + 1}:
                    <br />
                    Percentage: {calculateYearGrade(year)}%
                    <br />
                    Formula: {yearWeights[year]?.[0] || 0}% * (sum of credits for modules in year / 5)
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Form.Group>
                  <Form.Label>Yearly Credits</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Yearly Credits"
                    value={yearCredits[yearIndex] || ""}
                    onChange={(event) => handleYearCreditsChange(yearIndex, event)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Year Weight (%)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Year Weight (%)"
                    value={yearWeights[yearIndex]?.[0] || ""}
                    onChange={(event) => handleYearWeightChange(yearIndex, event)}
                  />
                </Form.Group>
                <br />
                <Button variant="primary" onClick={() => addModule(yearIndex)}>
                  Add Module
                </Button>
                <br />
                <br />
                {modules.map((module, index) => {
                  if (moduleYears[index] === yearIndex + 1) {
                    return (
                      <Card style={{ padding: "20px;" }} key={index}>
                        <Form.Group>
                          <Form.Label>Module Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Module Name"
                            value={module}
                            onChange={(event) => handleModuleChange(index, event)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Grade (%)</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Grade (%)"
                            value={gradeData[index] || ""}
                            onChange={(event) => handleGradeChange(index, event)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Module Credits</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Module Credits"
                            value={moduleCredits[index] || ""}
                            onChange={(event) => handleCreditsChange(index, event)}
                          />
                        </Form.Group>
                        <Button variant="danger" onClick={() => removeModule(index)}>
                          Remove Module
                        </Button>
                      </Card>
                    );
                  } else {
                    return null;
                  }
                })}
              </>
            )}
          </Col>
        ))}
      </Row>
      <br />
      <Button variant="primary" onClick={calculateFinalGrade}>
        Calculate Final Grade
      </Button>
      <h2>Final Grade: {finalGrade}</h2>
    </Container>
  );
};

export default GradeCalculator;
