import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import {
  Modal,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Paper,
  Divider,
  Box
} from '@mui/material';
import { projectFirestore } from "../../firebase/config";

const componentTypes = [
  { value: 'heading', label: 'Heading' },
  { value: 'title', label: 'Title' },
  { value: 'description', label: 'Description' },
  { value: 'box', label: 'Box' },
  { value: 'box-row', label: 'Box Row' },
  { value: 'image-gallery', label: 'Image Gallery' },
  { value: 'divider', label: 'Divider' }
];

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const styles = {
  componentBuilder: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  viewMode: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    position: 'relative'
  },
  emptyState: {
    width: '100%',
    minHeight: '300px',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    '&:hover': {
      borderColor: '#666',
      backgroundColor: '#f9f9f9'
    }
  },
  plusIcon: {
    fontSize: '48px',
    color: '#666'
  },
  componentContainer: {
    margin: '20px 0',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    position: 'relative'
  },
  componentActions: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    display: 'flex',
    gap: '5px'
  },
  actionButtons: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    padding: '24px',
    borderRadius: '8px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
    gap: '8px'
  },
  imageGallery: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px'
  },
  imagePreview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  boxContainer: {
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    minWidth: '150px',
    maxWidth: '180px',
    margin: '8px'
  },
  boxRowContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    margin: '10px 0'
  },
  boxLabel: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  boxDescription: {
    fontSize: '1rem'
  },
  editButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  },
  backButton: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1000,
    backgroundColor: '#757575',
    color: 'white',
    '&:hover': {
      backgroundColor: '#616161'
    }
  },
  saveButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#388e3c'
    }
  },
  addButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  }
};

const ComponentBuilder = () => {
  const [components, setComponents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newComponent, setNewComponent] = useState({
    id: '',
    type: '',
    content: '',
    size: 'medium',
    color: '#000000',
    alignment: 'left',
    images: [],
    label: '',
    description: '',
    boxes: []
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newBox, setNewBox] = useState({
    label: '',
    description: ''
  });
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const snapshot = await projectFirestore.collection('m-society').get();
        const loadedComponents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComponents(loadedComponents);
      } catch (error) {
        console.error('Error loading components:', error);
      }
    };

    fetchComponents();
  }, []);

  const saveComponent = async (component) => {
    try {
      const componentId = component.id || generateId();
      const componentRef = projectFirestore.collection('m-society').doc(componentId);
      await componentRef.set({
        ...component,
        id: componentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return componentId;
    } catch (error) {
      console.error('Error saving component:', error);
      return null;
    }
  };

  const deleteComponent = async (id) => {
    try {
      await projectFirestore.collection('m-society').doc(id).delete();
      setComponents(components.filter(comp => comp.id !== id));
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

  const handleAddComponent = () => {
    setNewComponent({
      id: '',
      type: '',
      content: '',
      size: 'medium',
      color: '#000000',
      alignment: 'left',
      images: [],
      label: '',
      description: '',
      boxes: []
    });
    setEditingId(null);
    setOpenModal(true);
  };

  const handleEditComponent = (id) => {
    const componentToEdit = components.find(comp => comp.id === id);
    if (componentToEdit) {
      setNewComponent(componentToEdit);
      setEditingId(id);
      setOpenModal(true);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl) {
      setNewComponent({
        ...newComponent,
        images: [...newComponent.images, newImageUrl]
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...newComponent.images];
    updatedImages.splice(index, 1);
    setNewComponent({
      ...newComponent,
      images: updatedImages
    });
  };

  const handleAddBox = () => {
    if (newBox.label && newBox.description) {
      setNewComponent({
        ...newComponent,
        boxes: [...newComponent.boxes, { ...newBox, id: generateId() }]
      });
      setNewBox({ label: '', description: '' });
    }
  };

  const handleRemoveBox = (index) => {
    const updatedBoxes = [...newComponent.boxes];
    updatedBoxes.splice(index, 1);
    setNewComponent({
      ...newComponent,
      boxes: updatedBoxes
    });
  };

  const handleSaveComponent = async () => {
    const componentId = await saveComponent(newComponent);
    if (componentId) {
      if (editingId) {
        setComponents(components.map(comp =>
          comp.id === editingId ? { ...newComponent, id: componentId } : comp
        ));
      } else {
        setComponents([...components, { ...newComponent, id: componentId }]);
      }
      setOpenModal(false);
    }
  };

  const handleSaveAll = async () => {
    setIsEditMode(false);
  };

  const handleEditAll = () => {
    setIsEditMode(true);
  };

  const renderComponent = (component) => {
    const style = {
      color: component.color,
      textAlign: component.alignment,
      fontSize: component.size === 'small' ? '0.8em' : component.size === 'large' ? '1.5em' : '1em'
    };

    switch (component.type) {
      case 'heading':
        return <Typography variant="h1" style={style}>{component.content}</Typography>;
      case 'title':
        return <Typography variant="h2" style={style}>{component.content}</Typography>;
      case 'description':
        return <Typography variant="body1" style={style}>{component.content}</Typography>;
      case 'box':
        return (
          <Paper elevation={3} style={{ ...styles.boxContainer, textAlign: component.alignment }}>
            <Typography variant="subtitle1" style={styles.boxLabel}>{component.label}</Typography>
            <Typography variant="body1" style={styles.boxDescription}>{component.description}</Typography>
          </Paper>
        );
      case 'box-row':
        return (
          <Box style={styles.boxRowContainer}>
            {component.boxes.map((box, index) => (
              <Paper key={box.id || index} elevation={3} style={styles.boxContainer}>
                <Typography variant="subtitle1" style={styles.boxLabel}>{box.label}</Typography>
                <Typography variant="body1" style={styles.boxDescription}>{box.description}</Typography>
              </Paper>
            ))}
          </Box>
        );
      case 'image-gallery':
        return (
          <Box style={{ textAlign: component.alignment }}>
            <Box style={styles.imageGallery}>
              {component.images.map((img, index) => (
                <Box key={index} style={{ position: 'relative' }}>
                  <img
                    src={img}
                    alt={`Gallery ${index}`}
                    style={styles.imagePreview}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        );
      case 'divider':
        return <Divider style={{ borderColor: component.color, width: '100%', margin: '20px 0' }} />;
      default:
        return null;
    }
  };

  // Preview Mode with Edit and Back Button
  if (!isEditMode) {
    return (
      <Box style={styles.viewMode}>
        <Button
          variant="contained"
          startIcon={<FaArrowLeft />}
          onClick={handleEditAll}
          style={styles.backButton}
          size="large"
        >
          Back to Edit
        </Button>

        <Button
          variant="contained"
          startIcon={<FaEdit />}
          onClick={handleEditAll}
          style={styles.editButton}
          size="large"
        >
          Edit
        </Button>

        {components.map((component) => (
          <Box key={component.id}>
            {renderComponent(component)}
          </Box>
        ))}
      </Box>
    );
  }

  // Edit Mode
  return (
    <Box style={styles.componentBuilder}>
      <Typography variant="h4" gutterBottom>Component Builder</Typography>

      {components.length === 0 ? (
        <Box style={styles.emptyState} onClick={handleAddComponent}>
          <FaPlus style={styles.plusIcon} />
          <Typography variant="body1" style={{ marginLeft: '10px' }}>Click to add your first component</Typography>
        </Box>
      ) : (
        <Box>
          {components.map((component) => (
            <Box key={component.id} style={styles.componentContainer}>
              {renderComponent(component)}
              <Box style={styles.componentActions}>
                <IconButton
                  onClick={() => handleEditComponent(component.id)}
                  color="primary"
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  onClick={() => deleteComponent(component.id)}
                  color="error"
                >
                  <FaTrash />
                </IconButton>
              </Box>
            </Box>
          ))}
          <Box style={styles.actionButtons}>
            <Button
              variant="contained"
              startIcon={<FaPlus />}
              onClick={handleAddComponent}
              style={styles.addButton}
            >
              Add Component
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAll}
              style={styles.saveButton}
              size="large"
            >
              Save & Preview
            </Button>
          </Box>
        </Box>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box style={styles.modalContent}>
          <Typography variant="h6" gutterBottom>
            {editingId ? 'Edit Component' : 'Add New Component'}
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Component Type</InputLabel>
            <Select
              value={newComponent.type}
              onChange={(e) => setNewComponent({
                ...newComponent,
                type: e.target.value,
                images: [],
                label: '',
                description: '',
                boxes: []
              })}
              label="Component Type"
            >
              {componentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {newComponent.type === 'image-gallery' && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={handleAddImage}
                style={{ marginTop: '10px', ...styles.addButton }}
              >
                Add Image
              </Button>
              <Box style={styles.imageGallery}>
                {newComponent.images.map((img, index) => (
                  <Box key={index} style={{ position: 'relative' }}>
                    <img
                      src={img}
                      alt={`Preview ${index}`}
                      style={styles.imagePreview}
                    />
                    <IconButton
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTrash />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {newComponent.type === 'box' && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Label/Heading"
                value={newComponent.label}
                onChange={(e) => setNewComponent({ ...newComponent, label: e.target.value })}
                placeholder="e.g., Builder's Name"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                value={newComponent.description}
                onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                placeholder="e.g., Guru Contractor"
              />
            </>
          )}

          {newComponent.type === 'box-row' && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Box Label"
                value={newBox.label}
                onChange={(e) => setNewBox({ ...newBox, label: e.target.value })}
                placeholder="e.g., Builder Name"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Box Description"
                value={newBox.description}
                onChange={(e) => setNewBox({ ...newBox, description: e.target.value })}
                placeholder="e.g., Monthly Maintenance $100"
              />
              <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={handleAddBox}
                style={{ marginTop: '10px', ...styles.addButton }}
              >
                Add Box
              </Button>
              <Box style={styles.boxRowContainer}>
                {newComponent.boxes.map((box, index) => (
                  <Paper key={box.id || index} elevation={3} style={styles.boxContainer}>
                    <Typography variant="subtitle1" style={styles.boxLabel}>{box.label}</Typography>
                    <Typography variant="body1" style={styles.boxDescription}>{box.description}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveBox(index)}
                      color="error"
                    >
                      <FaTrash />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </>
          )}

          {(newComponent.type && !['image-gallery', 'box', 'box-row'].includes(newComponent.type)) && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Content"
                value={newComponent.content}
                onChange={(e) => setNewComponent({ ...newComponent, content: e.target.value })}
                multiline={newComponent.type === 'description'}
                rows={newComponent.type === 'description' ? 4 : 1}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Size</InputLabel>
                <Select
                  value={newComponent.size}
                  onChange={(e) => setNewComponent({ ...newComponent, size: e.target.value })}
                  label="Size"
                >
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Alignment</InputLabel>
                <Select
                  value={newComponent.alignment}
                  onChange={(e) => setNewComponent({ ...newComponent, alignment: e.target.value })}
                  label="Alignment"
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
              </FormControl>

              {newComponent.type !== 'divider' && (
                <TextField
                  fullWidth
                  margin="normal"
                  type="color"
                  label="Color"
                  value={newComponent.color}
                  onChange={(e) => setNewComponent({ ...newComponent, color: e.target.value })}
                />
              )}
            </>
          )}

          <Box style={styles.modalActions}>
            <Button variant="outlined" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveComponent}
              style={styles.saveButton}
            >
              {editingId ? 'Update' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ComponentBuilder;