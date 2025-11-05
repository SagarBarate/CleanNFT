import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Checkbox,
  FormControlLabel,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { cleannftApi } from '../api';
import { loadManifestFromFile, ManifestEntry, manifestEntriesToMintItems, getManifestStats } from '../manifest';
import { ipfsToHttp } from '../utils/ipfs';

interface MintFormProps {
  onMintSuccess?: () => void;
}

const MintForm: React.FC<MintFormProps> = ({ onMintSuccess }) => {
  const [manifestEntries, setManifestEntries] = useState<ManifestEntry[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());
  const [manualTokenUri, setManualTokenUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dropzone for manifest.json
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setError(null);
      setLoading(true);
      
      const file = acceptedFiles[0];
      if (!file.name.endsWith('.json')) {
        throw new Error('Please select a JSON file');
      }
      
      const manifest = await loadManifestFromFile(file);
      setManifestEntries(manifest.entries);
      setSelectedEntries(new Set());
      
      setSuccess(`Loaded ${manifest.validEntries} valid entries from manifest`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load manifest');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  // Handle manual token URI addition
  const addManualToken = () => {
    if (!manualTokenUri.trim()) return;
    
    const newEntry: ManifestEntry = {
      index: manifestEntries.length,
      name: `Manual NFT ${manifestEntries.length + 1}`,
      imageUri: '',
      tokenUri: manualTokenUri.trim(),
    };
    
    setManifestEntries(prev => [...prev, newEntry]);
    setManualTokenUri('');
  };

  // Handle entry selection
  const toggleEntrySelection = (index: number) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedEntries(newSelected);
  };

  // Handle minting
  const handleMint = async () => {
    if (selectedEntries.size === 0) {
      setError('Please select at least one entry to mint');
      return;
    }

    try {
      setMinting(true);
      setError(null);
      
      const selectedItems = Array.from(selectedEntries).map(index => manifestEntries[index]);
      const mintItems = manifestEntriesToMintItems(selectedItems);
      
      const results = await cleannftApi.mint(mintItems);
      
      if (results.length > 0) {
        const successCount = results.filter(r => r.success).length;
        setSuccess(`Successfully minted ${successCount} NFTs!`);
        
        // Clear selection
        setSelectedEntries(new Set());
        
        // Call success callback
        onMintSuccess?.();
      } else {
        setError('Minting failed - no results returned');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Minting failed');
    } finally {
      setMinting(false);
    }
  };

  // Get manifest statistics
  const stats = getManifestStats(manifestEntries);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mint NFTs
      </Typography>
      
      {/* File Upload Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Import Manifest File
        </Typography>
        
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'primary.50' : 'grey.50',
            '&:hover': {
              bgcolor: 'primary.50',
              borderColor: 'primary.main',
            },
          }}
        >
          <input {...getInputProps()} />
          <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop manifest.json here' : 'Drag & drop manifest.json'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse files
          </Typography>
        </Box>
        
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      {/* Manual Token URI Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Manual Token URI
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              label="Token URI"
              value={manualTokenUri}
              onChange={(e) => setManualTokenUri(e.target.value)}
              placeholder="ipfs://QmHash or https://..."
              onKeyPress={(e) => e.key === 'Enter' && addManualToken()}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addManualToken}
              disabled={!manualTokenUri.trim()}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Manifest Statistics */}
      {manifestEntries.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Manifest Statistics
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item>
              <Chip label={`Total: ${stats.total}`} color="default" />
            </Grid>
            <Grid item>
              <Chip label={`Valid: ${stats.valid}`} color="success" />
            </Grid>
            <Grid item>
              <Chip label={`With Images: ${stats.withImages}`} color="info" />
            </Grid>
            <Grid item>
              <Chip label={`Valid: ${stats.validPercentage}%`} color="primary" />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Manifest Entries Grid */}
      {manifestEntries.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1">
              Select Entries to Mint ({selectedEntries.size} selected)
            </Typography>
            
            <Button
              variant="contained"
              onClick={handleMint}
              disabled={selectedEntries.size === 0 || minting}
              startIcon={minting ? <CircularProgress size={20} /> : undefined}
            >
              {minting ? 'Minting...' : `Mint Selected (${selectedEntries.size})`}
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {manifestEntries.map((entry, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={entry.imageUri ? ipfsToHttp(entry.imageUri) : '/placeholder-image.png'}
                    alt={entry.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {entry.name}
                    </Typography>
                    {entry.description && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {entry.description}
                      </Typography>
                    )}
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Index: {entry.index}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedEntries.has(index)}
                          onChange={() => toggleEntrySelection(index)}
                        />
                      }
                      label="Select"
                    />
                    
                    <Box sx={{ ml: 'auto' }}>
                      <Tooltip title="View Metadata">
                        <IconButton
                          size="small"
                          onClick={() => window.open(ipfsToHttp(entry.tokenUri), '_blank')}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="View Image">
                        <IconButton
                          size="small"
                          onClick={() => window.open(ipfsToHttp(entry.imageUri), '_blank')}
                          disabled={!entry.imageUri}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default MintForm;
