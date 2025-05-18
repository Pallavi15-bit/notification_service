import React from 'react';
import UserForm from '../components/UserForm';

function AddUser() {
  return (
    <div className="add-user-page">
      <h1>Add New User</h1>
      <div className="card">
        <div className="card-body">
          <UserForm />
        </div>
      </div>
    </div>
  );
}

export default AddUser;
