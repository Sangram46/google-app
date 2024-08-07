
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Card, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [show, setShow] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [viewTask, setViewTask] = useState(null); // New state for view task
    const [newTask, setNewTask] = useState({ name: '', description: '', status: 'To Do', createdDate: new Date().toISOString().split('T')[0] });
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('recent');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleAddTask = async () => {
        try {
            await axios.post('http://localhost:5000/api/tasks/add', newTask);
            fetchTasks();
            setNewTask({ name: '', description: '', status: 'To Do', createdDate: new Date().toISOString().split('T')[0] });
            setShow(false);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleEditTask = async () => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/update/${editTask.id}`, editTask);
            fetchTasks();
            setEditTask(null);
            setShow(false);
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`http://localhost:5000/api/tasks/delete/${id}`);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleViewDetails = (task) => {
        setViewTask(task); // Set the task to be viewed
        setShow(true);
    };

    const handleSearch = (task) => {
        if (search === '') return true;
        return task.name.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase());
    };

    const sortedTasks = tasks
        .filter(handleSearch)
        .sort((a, b) => (sort === 'recent' ? new Date(b.createdDate) - new Date(a.createdDate) : a.name.localeCompare(b.name)));

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        const updatedTasks = Array.from(tasks);
        const [movedTask] = updatedTasks.splice(source.index, 1);
        movedTask.status = destination.droppableId;
        updatedTasks.splice(destination.index, 0, movedTask);

        setTasks(updatedTasks);

        // Update task status in the backend
        try {
            await axios.put(`http://localhost:5000/api/tasks/update/${movedTask.id}`, { ...movedTask, status: destination.droppableId });
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div className="container mt-5">
            <Button style={{ marginBottom: "10px" }} onClick={() => setShow(true)}>Add Task</Button>
            <div className="card" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                <div className="" style={{ padding: "20px" }} >
                    <Form.Control style={{ width: "400px", float: "left", marginLeft: "30px" }}
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Form.Control style={{ width: "400px", float: "right", marginRight: "30px" }}
                        as="select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="recent">Sort by Recent</option>
                        <option value="alphabetical">Sort Alphabetically</option>
                    </Form.Control>
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Row className="mt-4" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                    {['To Do', 'In Progress', 'Done'].map((status, index) => (
                        <Col key={index} md={4}  >
                            <h3 style={{background:"#007FFF",color:"white",marginTop:"15px"}}>{status}</h3>
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '100px' }}>
                                        {sortedTasks.filter(task => task.status === status).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided) => (
                                                    <Card style={{ borderRadius: "40px" }}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mb-2"
                                                    >
                                                        <Card.Body style={{ background: "#ADD8E6" }}>
                                                            <Card.Title>{task.name}</Card.Title>
                                                            <Card.Text>{task.description}</Card.Text>
                                                            <Card.Text><small>{task.createdDate}</small></Card.Text>
                                                            <Button variant="danger" style={{ marginRight: "10px" }} onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                                                            <Button variant="warning" style={{ marginRight: "10px", background: "#87CEFA", border: "#87CEFA" }} onClick={() => { setEditTask(task); setShow(true); }}>Edit</Button>
                                                            <Button variant="primary" onClick={() => handleViewDetails(task)}>View Details</Button>
                                                        </Card.Body>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                    ))}
                </Row>
            </DragDropContext>

            {/* Add/Edit Task Modal */}
            <Modal show={show} onHide={() => { setShow(false); setEditTask(null); setViewTask(null); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{editTask ? 'Edit Task' : viewTask ? 'View Details' : 'Add Task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTaskName">
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task name"
                                value={editTask ? editTask.name : viewTask ? viewTask.name : newTask.name}
                                onChange={(e) => (editTask ? setEditTask({ ...editTask, name: e.target.value }) : setNewTask({ ...newTask, name: e.target.value }))}
                                readOnly={!!viewTask} // Read-only when viewing details
                            />
                        </Form.Group>
                        <Form.Group controlId="formTaskDescription" className="mt-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={editTask ? editTask.description : viewTask ? viewTask.description : newTask.description}
                                onChange={(e) => (editTask ? setEditTask({ ...editTask, description: e.target.value }) : setNewTask({ ...newTask, description: e.target.value }))}
                                readOnly={!!viewTask} // Read-only when viewing details
                            />
                        </Form.Group>
                        <Form.Group controlId="formTaskStatus" className="mt-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={editTask ? editTask.status : viewTask ? viewTask.status : newTask.status}
                                onChange={(e) => (editTask ? setEditTask({ ...editTask, status: e.target.value }) : setNewTask({ ...newTask, status: e.target.value }))}
                                readOnly={!!viewTask} // Read-only when viewing details
                            >
                                <option>To Do</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formTaskCreatedDate" className="mt-2">
                            <Form.Label>Created Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={editTask ? editTask.createdDate.split('T')[0] : viewTask ? viewTask.createdDate.split('T')[0] : newTask.createdDate}
                                onChange={(e) => (editTask ? setEditTask({ ...editTask, createdDate: e.target.value }) : setNewTask({ ...newTask, createdDate: e.target.value }))}
                                readOnly={!!viewTask} // Read-only when viewing details
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {editTask && !viewTask && <Button variant="primary" onClick={handleEditTask}>Save Changes</Button>}
                    {!editTask && !viewTask && <Button variant="primary" onClick={handleAddTask}>Add Task</Button>}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TaskPage;


