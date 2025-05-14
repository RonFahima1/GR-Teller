const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read the import configuration
const config = JSON.parse(fs.readFileSync('plasmic-import.json', 'utf8'));

// Function to import a component
async function importComponent(componentPath, componentName) {
  try {
    console.log(`Importing component: ${componentName}`);
    // Create a temporary file with the component content
    const tempPath = path.join(process.cwd(), 'temp', componentName + '.tsx');
    fs.mkdirSync(path.dirname(tempPath), { recursive: true });
    
    // Copy the component content
    fs.copyFileSync(componentPath, tempPath);
    
    // Run the Plasmic import command with project ID
    execSync(`npx plasmic import ${tempPath} --name ${componentName} --project-id g6nEhkscPr3yPu5TXeD7BX`);
    
    // Clean up temporary file
    fs.unlinkSync(tempPath);
    
    console.log(`Successfully imported: ${componentName}`);
  } catch (error) {
    console.error(`Error importing ${componentName}:`, error);
  }
}

// Function to import a page
async function importPage(pagePath, pageName) {
  try {
    console.log(`Importing page: ${pageName}`);
    // Create a temporary file with the page content
    const tempPath = path.join(process.cwd(), 'temp', pageName + '.tsx');
    fs.mkdirSync(path.dirname(tempPath), { recursive: true });
    
    // Copy the page content
    fs.copyFileSync(pagePath, tempPath);
    
    // Run the Plasmic import command with project ID
    execSync(`npx plasmic import ${tempPath} --name ${pageName} --type page --project-id g6nEhkscPr3yPu5TXeD7BX`);
    
    // Clean up temporary file
    fs.unlinkSync(tempPath);
    
    console.log(`Successfully imported: ${pageName}`);
  } catch (error) {
    console.error(`Error importing ${pageName}:`, error);
  }
}

// Import all components
async function importAllComponents() {
  console.log('Starting component import process...');
  
  // Create temporary directory
  const tempDir = path.join(process.cwd(), 'temp');
  fs.mkdirSync(tempDir, { recursive: true });

  // Import components
  for (const component of config.components) {
    await importComponent(component.path, component.name);
  }

  // Import pages
  for (const page of config.pages) {
    await importPage(page.path, page.name);
  }

  // Clean up temporary directory
  fs.rmdirSync(tempDir, { recursive: true });

  console.log('Component import process completed!');
}

// Run the import process
importAllComponents();
