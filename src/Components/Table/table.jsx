import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './table.css';

const Table = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleUpdate = async (updatedStudent) => {
    try {
      const response = await axios.patch(`http://localhost:3000/students/${updatedStudent._id}`, updatedStudent);
      const updatedStudents = students.map((student) =>
        student._id === response.data._id ? response.data : student
      );
      setStudents(updatedStudents);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <div>
      <h1>Lista de Estudiantes</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Calificaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{editingStudent?._id === student._id ? (
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, name: e.target.value })
                  }
                />
              ) : (
                student.name
              )}
              </td>
              <td>{editingStudent?._id === student._id ? (
                <input
                  type="number"
                  value={editingStudent.age}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, age: e.target.value })
                  }
                />
              ) : (
                student.age
              )}
              </td>
              <td>
                {editingStudent?._id === student._id ? (
                  student.grades.map((grade, index) => (
                    <div key={index}>
                      <input
                        type="number"
                        value={grade.semester}
                        onChange={(e) => {
                          const updatedGrades = [...editingStudent.grades];
                          updatedGrades[index].semester = e.target.value;
                          setEditingStudent({ ...editingStudent, grades: updatedGrades });
                        }}
                      />
                      <input
                        type="number"
                        value={grade.grade}
                        onChange={(e) => {
                          const updatedGrades = [...editingStudent.grades];
                          updatedGrades[index].grade = e.target.value;
                          setEditingStudent({ ...editingStudent, grades: updatedGrades });
                        }}
                      />
                    </div>
                  ))
                ) : (
                  student.grades.map((grade, index) => (
                    <div key={index}>
                      Semestre {grade.semester}: {grade.grade}
                    </div>
                  ))
                )}
              </td>
              <td>
                {editingStudent?._id === student._id ? (
                  <>
                    <button className="guardar" onClick={() => handleUpdate(editingStudent)}>
                      Guardar
                    </button>
                    <button className="cancelar" onClick={() => setEditingStudent(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button className="editar" onClick={() => handleEdit(student)}>
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;