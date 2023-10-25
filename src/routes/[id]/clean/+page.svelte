<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    
    let data;
  
    // Helper function to check for and log missing values
    function checkAndLogMissingValues(data) {
      var missingValues = data.filter(function(d) {
        return d.value === null || d.value === undefined;
      });
  
      // Log the missing values
      console.log("Missing Values:");
      console.log(missingValues);
  
      // Check if there are any missing values
      if (missingValues.length > 0) {
        console.log("There are missing values in the data.");
      } else {
        console.log("No missing values found in the data.");
      }
    }
  
    // Helper function to save data as a CSV file
    function saveAsCSV(data, filename) {
      const csv = "id,value\n" + data.map(d => `${d.id},${d.value}`).join("\n");
  
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
  
      document.body.appendChild(a);
      a.click();
  
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  
    onMount(async () => {
      // Read CSV data using D3
      data = await d3.csv('your_data.csv');
  
      // Check for and log missing values
      checkAndLogMissingValues(data);
  
      // Option 1: Remove rows with missing values
      data = data.filter(function(d) {
        return d.value !== null && d.value !== undefined;
      });
  
      // Option 2: Impute missing values with a specific value (e.g., mean)
      var sum = 0;
      var count = 0;
  
      data.forEach(function(d) {
        if (d.value !== null && d.value !== undefined) {
          sum += parseFloat(d.value);
          count++;
        }
      });
  
      var mean = sum / count;
  
      // Replace missing values with the mean
      data.forEach(function(d) {
        if (d.value === null || d.value === undefined) {
          d.value = mean;
        }
      });
  
      // Option 3: Impute missing values with forward fill
      var previousValue = null;
  
      data.forEach(function(d) {
        if (d.value === null) {
          d.value = previousValue;
        } else {
          previousValue = d.value;
        }
      });
  
      // Save the cleaned data back to a CSV file
      saveAsCSV(data, 'cleaned_data.csv');
    });
  </script>
  