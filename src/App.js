import './App.css';
import React, { useState, useEffect } from 'react';
import {v4 as uuid} from 'uuid';
import { patients } from './data/patients';

const App = () => {
  const [ fetchedPatients, updateFetchedPatients ] = useState([]);
  const [ isAddingPatient, updateIsAddingPatient ] = useState(false);
  const [ newPatient, updateAddNewPatient ] = useState({
    id: null,
    first_name: "",
    last_name: "",
    medical_id: null,
    age: null,
    sex: "",
  });

  useEffect(() => {
    // faking an ajax call
    const fetchData = async () => {
      const data = await patients;
      // where you would convert the response to json
      // const json = await data.json();
      updateFetchedPatients(data)
      updateAddNewPatient({
        id: uuid(),
      })
    };
  
    fetchData();
  }, []);

  const addNewPatient = () => {
    updateIsAddingPatient(!isAddingPatient);
  };

  const updateNewPatient = (e) => {
    // would like to create a component and read the props if I had more time
    const { target } = e;
    const { dataset, value } = target;
    const { key } = dataset;
    updateAddNewPatient({
      ...newPatient,
      [key]: value,
    })
  }

  const saveAddNewPatient = () => {
    // here is where you would make a call to a database to save the patient
    updateFetchedPatients(oldPatients => [...oldPatients, newPatient]);
    updateAddNewPatient({
      id: uuid(),
    })
  }

  const updateExistingPatient = (e) => {
    const { target } = e;
    const { dataset, value } = target;
    const { key, id } = dataset;
    const patientIndex = fetchedPatients.findIndex(p => String(p.id) === String(id));
    let patient = fetchedPatients[patientIndex];
    patient = {
      ...patient,
      [key]: value,
    };
    let newArr = [...fetchedPatients];
    newArr[patientIndex] = patient;
    updateFetchedPatients(newArr);
  }

  const deletePatient = (e) => {
    const { target } = e;
    const { dataset } = target;
    const { id } = dataset;
    const updatedPatients = fetchedPatients.filter(p => String(p.id) !== String(id));
    updateFetchedPatients(updatedPatients);
  }

  return (
    <div className="App">
      <h1>Patients</h1>
      {/* could be done with a form  */}
      <table>
        <thead>
          <tr>
            <th>
              First Name
            </th>
            <th>
              Last Name
            </th>
            <th>
              Medical ID
            </th>
            <th>
              Age
            </th>
            <th>
              Sex
            </th>
          </tr>
        </thead>
        <tbody>
        {
        fetchedPatients.map((p) => {
          // convert this to function so it can handle both new and existing patients
          return (
            <tr key={p.id}>
              <td>
                <input onChange={updateExistingPatient} data-id={p.id} data-key="first_name" type="text" value={p.first_name} />
              </td>
              <td>
                <input onChange={updateExistingPatient} data-id={p.id} data-key="last_name" type="text" value={p.last_name} />
              </td>
              <td>
                <input onChange={updateExistingPatient} data-id={p.id} data-key="medical_id" type="number" value={p.medical_id} />
              </td>
              <td>
                <input onChange={updateExistingPatient} data-id={p.id} data-key="age" type="number" value={p.age} />
              </td>
              <td>
                <select onChange={updateExistingPatient} data-id={p.id} data-key="sex" value={p.sex}>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Other">Other</option>
                </select>
              </td>
              <td>
                <button onClick={deletePatient} data-id={p.id}>Delete</button>
              </td>
            </tr>
          );
        })
      }
          { isAddingPatient && (
            <tr key={fetchedPatients.length + 1}>
              <td>
                <input onChange={updateNewPatient} data-key="first_name" type="text" value={newPatient.first_name} />
              </td>
              <td>
                <input onChange={updateNewPatient} data-key="last_name" type="text" value={newPatient.last_name} />
              </td>
              <td>
                <input onChange={updateNewPatient} data-key="medical_id" type="number" value={newPatient.medical_id} />
              </td>
              <td>
                <input onChange={updateNewPatient} data-key="age" type="number" value={newPatient.age} />
              </td>
              <td>
                <select onChange={updateNewPatient} data-key="sex" value={newPatient.sex}>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Other">Other</option>
                </select>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isAddingPatient && <button onClick={saveAddNewPatient}>Save</button>}
      <button onClick={addNewPatient}>{ isAddingPatient ? "Cancel" : "Add New"}</button>
    </div>
  );
};

export default App;
