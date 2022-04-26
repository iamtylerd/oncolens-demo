import './App.css';
import React, { useState, useEffect } from 'react';
import {v4 as uuid} from 'uuid';
import { patients } from './data/patients';
import { capitalize } from './helpers/text';

const App = () => {
  const [ fetchedPatients, updateFetchedPatients ] = useState([]);
  const [ isAddingPatient, updateIsAddingPatient ] = useState(false);
  const [ searchTerm, updateSearchTerm ] = useState("");
  const [ newPatient, updateAddNewPatient ] = useState({});

  useEffect(() => {
    // faking an ajax call
    const fetchData = async () => {
      const data = await patients;
      // where you would convert the response to json
      // const json = await data.json();
      updateFetchedPatients(data);
      // not sure if the patient should be inited here or when its defined in useState
      updateAddNewPatient({
        id: uuid(),
        first_name: "",
        last_name: "",
        medical_id: "",
        age: "",
        sex: "",
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
      [key]: capitalize(value),
    });
  };

  const saveAddNewPatient = () => {
    // here is where you would make a call to a database to save the patient
    updateFetchedPatients(oldPatients => [...oldPatients, newPatient]);
    updateIsAddingPatient(false);
    updateAddNewPatient({
      id: uuid(),
    });
  };

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
  };

  const deletePatient = (e) => {
    const { target } = e;
    const { dataset } = target;
    const { id } = dataset;
    const updatedPatients = fetchedPatients.filter(p => String(p.id) !== String(id));
    updateFetchedPatients(updatedPatients);
  };

  const sortColumns = (e) => {
    // with more time i would track asc or desc and flip the sort accordingly
    const { target } = e;
    const { dataset } = target;
    const { key } = dataset;
    const unSortedPatients = [...fetchedPatients];
    // using the < vrs - for comparing numbers and strings
    const sortedPatients = unSortedPatients.sort((first, second) => first[key] < second[key] ? -1 : 1);
    updateFetchedPatients(sortedPatients);
  };

  const filterPatients = (e) => {
    // would add some validation / data checks here
    const { target } = e;
    const { value } = target;
    updateSearchTerm(value);
  };

  return (
    <div className="App">
      <h1>Patients</h1>
      {/* could be done with a form  */}
      <table>
        <thead>
          {/* would like to create new components and use props instead of data attr  */}
          <tr>
            <th onClick={sortColumns} data-key="first_name">
              First Name
              <input onChange={filterPatients} value={searchTerm} type="string" />
            </th>
            <th onClick={sortColumns} data-key="last_name">
              Last Name
            </th>
            <th onClick={sortColumns} data-key="medical_id">
              Medical ID
            </th>
            <th onClick={sortColumns} data-key="age">
              Age
            </th>
            <th onClick={sortColumns} data-key="sex">
              Sex
            </th>
          </tr>
        </thead>
        <tbody>
        {
        fetchedPatients.filter(p =>  new RegExp(`^${searchTerm}`, `i`).test(p.first_name.toLowerCase())).map((p) => {
          // convert this to function so it can handle both new and existing patients
          // would make filtering more robust by making it a function and the ability to handle multiple filters
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
      {/* check for all fields and disable button if not completed  */}
      {isAddingPatient && <button onClick={saveAddNewPatient}>Save</button>}
      <button onClick={addNewPatient}>{ isAddingPatient ? "Cancel" : "Add New"}</button>
    </div>
  );
};

export default App;
