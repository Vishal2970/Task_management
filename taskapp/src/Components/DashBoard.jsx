import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function DashBoard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { token, isAdmin } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [comment, setComment] = useState('');
    // Fetch users for dropdown
    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://task-management-0s3d.onrender.com/api/auth', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleAssignTask = async (taskId, userId) => {
        try {
            // alert("taskId");
            // alert(taskId);
            // alert("userId");
            // alert(userId);
            await axios.put(
                `https://task-management-0s3d.onrender.com/api/tasks/${taskId}/assign`,
                { assigneeId: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Task assigned successfully');
            fetchTasks();
        } catch (err) {
            console.error('Error assigning task:', err);
            alert('Failed to assign task ');
        }
    };

    const navigate = useNavigate();
    const fetchTasks = async () => {
        try {
            const response = await axios.get('https://task-management-0s3d.onrender.com/api/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            if (err.response && err.response.status === 401) {
                localStorage.clear();
                sessionStorage.clear();
                navigate('/');
            } else {
                setError('Failed to load tasks');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleShowDetails = (task) => {
        setSelectedTask(task);
        setShowDetailPopup(true);
    };


    useEffect(() => {
        if (!token) {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/');
            return;
        }
        fetchTasks();
        fetchUsers();
    }, [token, navigate]);

    //Create Task Handler
    const handleCreateTask = async () => {
        if (!title.trim() || !description.trim()) {
            alert('Please enter title and description');
            return;
        }
        try {
            await axios.post(
                'https://task-management-0s3d.onrender.com/api/tasks',
                { title, description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert('Task created successfully ');
            setShowPopup(false);
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Failed to create task ');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(
                `https://task-management-0s3d.onrender.com/api/tasks/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            console.error('Error delete task:', error);
            alert('Failed to delete task');
        }
    }

    const completeTask = async (taskId, commentText = "") => {
        try {
            await axios.put(
                `https://task-management-0s3d.onrender.com/api/tasks/${taskId}/complete`,
                { comment: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Task completed successfully');
            fetchTasks();
        } catch (err) {
            console.error('Error completing task:', err);
            alert('Failed to complete task');
        }
    };


    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px', position: 'relative' }}>
            <h2>{sessionStorage.getItem("name")}-Dashboard</h2>

            {tasks.length === 0 ? (
                <p>No tasks found</p>
            ) : (
                <table
                    border="1"
                    cellPadding="10"
                    style={{ borderCollapse: 'collapse', width: '100%' }}
                >
                    <thead>
                        <tr>
                            <th>Task ID</th>
                            <th>Title</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (

                            <tr key={task._id}>
                                {/* <td>{task._id.slice(-5)}</td>
                                <td>{task.title}</td> */}
                                <td
                                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => handleShowDetails(task)}
                                >
                                    {task._id.slice(-5)}
                                </td>
                                <td
                                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => handleShowDetails(task)}
                                >
                                    {task.title}
                                </td>

                                <td>
                                    {task.status === 'completed'
                                        ? `${task.currentOwner?.name} is completed`
                                        : task.assignedTo?.name || 'Not Assigned yet'}
                                </td>

                                <td>{task.status}</td>
                                <td>{new Date(task.createdAt).toLocaleString()}</td>

                                {/* Dropdown for Assign To */}
                                {isAdmin && task.status !== 'completed' && (<td>
                                    <select
                                        value={task.assignedTo || ''}
                                        onChange={(e) => handleAssignTask(task._id, e.target.value)}
                                    >
                                        <option value="">Select user</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user._id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>)}

                                {/* Actions */}
                                <td>
                                    {!isAdmin && (<button
                                        onClick={() => {
                                            setSelectedTaskId(task._id);
                                            setShowCommentPopup(true);
                                        }}
                                        style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}
                                    >
                                        Complete
                                    </button>
                                    )}

                                    {isAdmin && task.status !== 'completed' && (
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            style={{ backgroundColor: 'red', color: 'white' }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}

            {/* Admin k liye Create Button */}
            {isAdmin && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={() => setShowPopup(true)}>Create Task</button>
                </div>
            )}

            {/* popup */}
            {showPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '350px',
                            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h3>Create Task</h3>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Title:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={() => setShowPopup(false)}>Close</button>
                            <button onClick={handleCreateTask}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/*Task Detail Popup */}
            {showDetailPopup && selectedTask && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '400px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                        }}
                    >
                        <h3>Task Details</h3>
                        <p><strong>Title:</strong> {selectedTask.title}</p>
                        <p><strong>Description:</strong> {selectedTask.description || 'No description'}</p>
                        {selectedTask.status === 'completed' && (
                            // <p><strong>`${selectedTask.currentOwner?.name.substring(' ')[0]}Comment:`</strong> {selectedTask.comments[0].text}</p>
                            <p><strong>{selectedTask.currentOwner?.name?.split(' ')[0]}'s Comment:</strong>{' '}{selectedTask.comments[0].text}</p>
                        )}
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        <p><strong>Created At:</strong> {new Date(selectedTask.createdAt).toLocaleString()}</p>
                        {/* <p><strong>Assigned To:</strong> {selectedTask.assignedTo?.name || 'Not Assigned yet'}</p> */}
                        <p><strong>Created By:</strong> {selectedTask.creator?.name || 'N/A'}</p>
                        {selectedTask.status !== 'completed' && (
                            <p><strong>Assigned To:</strong> {selectedTask.assignedTo?.name || 'Not Assigned yet'}</p>
                        )}
                        {selectedTask.status === 'completed' && (
                            <p><strong>Completed by:</strong> {selectedTask.currentOwner?.name || 'N/A'}</p>
                        )}

                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={() => setShowDetailPopup(false)}>Close</button>
                            {isAdmin && (
                                <button
                                    style={{ backgroundColor: 'red', color: 'white' }}
                                    onClick={() => {
                                        deleteTask(selectedTask._id);
                                        setShowDetailPopup(false);
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/*Comment Popup Before Completing   Task */}
            {showCommentPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '350px',
                            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h3>Add Comment (Optional)</h3>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your comment here..."
                            style={{ width: '100%', height: '80px', padding: '5px', marginTop: '10px' }}
                        ></textarea>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <button onClick={() => setShowCommentPopup(false)}>Cancel</button>
                            <button
                                style={{ backgroundColor: 'green', color: 'white' }}
                                onClick={() => {
                                    completeTask(selectedTaskId, comment);
                                    setComment('');
                                    setShowCommentPopup(false);
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

export default DashBoard;
