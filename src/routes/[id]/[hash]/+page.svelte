<script>
  import { goto } from '$app/navigation';
  export let data;
  import { onMount } from 'svelte';
  import * as d3 from "d3";

  let loaded = false;
  let project;
  let url = 'https://apis.149segolte.dev/minor';

  onMount(async () => {
  //  Changes in JS
  let res = await fetch(`${url}/projects`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  });
  const data = await res.json();
  project = data.projects.filter(proj => proj.id === data.project_id)
  loaded = true;


   });

  let model_data;

  onMount(async () => {
    // Load data from the CSV file
    let lossData = [];

    await d3.csv("loss_data.csv", (data) => {
      lossData.push(Number(data.value)); // Assuming your CSV has a "value" column
    });

    // Create the loss function using D3
    const width = 300;
    const height = 150;

    const svg = d3.select("#loss-function")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Define scales for the x and y axes
    const xScale = d3.scaleLinear()
      .domain([0, lossData.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(lossData)])
      .nice()
      .range([height, 0]);

    // Create a line generator for the loss function
    const lossFunction = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

    // Add the loss function line to the SVG
    svg.append("path")
      .datum(lossData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lossFunction);
  });
</script>

<div>    
  <div>
    <div class="flex items-center justify-between bg-gray-300 p-4 mb-4">
      {#if loaded}
        <span class="text-2xl font-semibold text-gray-700 px-8">{project.name}</span>
      {/if}
      <div class="flex justify-end">
        <button class="bg-gray-700 text-white px-4 py-2 rounded-full mr-10 hover-bg-gray-800">Edit Project</button>
        <button class="bg-gray-700 text-white px-4 py-2 rounded-full hover-bg-gray-800">Add Project</button>
      </div>
    </div>
  </div>
  <div class="mx-20 mt-10">
    <div>
      <h1 class="text-black font-sans text-3xl leading-normal">Training Summary</h1>
      <p class="mt-4 font-sans text-lg text-gray-700"> Your dataset had {model_data.config.shape[0]} rows and {model_data.config.shape[1]} columns, {model_data.config.shape[0]} rows were used in training, {model_data.config.test_size} rows were used in testing, and {model_data.config.shape[1]} columns, {model_data.config.shape[0]} rows were used in training, {model_data.config.train_size} rows were used in model comparison. The model is a {model_data.config.shape[1]} columns, {model_data.config.shape[0]} rows were used in training, {model_data.config.batch_size} rows were used in model comparison</p>
    </div>
    <div class="mt-4 font-sans text-lg">
      <h1 class="text-black font-sans text-3xl leading-normal">Metrics</h1>
      <p class="mt-4 text-gray-700">Your model was evaluated on the test dataset and accurately classified 100% of the examples. This is compared with the baseline accuracy of 23.33%, which is what the model would get if it always predicted the majority class.</p>
    </div>
  </div>
  <div class="mt-10 mx-20 border h-36 border-gray-300 bg-gray-100 rounded-sm">
    <div class="text-center">
      <p class="text-xl mt-3">Accuracy</p>
      <p class="text-lg text-green-500">76.67%</p>
    </div>
    <div class="flex justify-center">
      <div class="text-center mr-4">
        <p class="text-3xl">23.33%</p>
        <span class="bg-gray-400 text-lg rounded-lg px-2">Baseline</span>
      </div>
      <div class="text-center">
        <p class="text-3xl">100%</p>
        <span class="text-lg bg-blue-400 rounded-lg px-2">Training</span>
      </div>
    </div>
  </div>
  <!-- Loss Function Graph -->
  <div id="loss-function" class="border border-gray-300 bg-gray-100 rounded-sm mt-10 h-96">
    <div>
      <p class="text-lg text-center font-sans">Training Loss By Round or Epoch</p>
      <div class="flex items-center justify-center">
        <div class="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
        <span class="text-lg">Loss</span>
      </div>
    </div>
  </div>
  <div class="text-center mt-4 ">
    <p class="font-semibold text-xl">Feature Importances</p>
    <p class="text-xl">The chart and table below show which features were most important to the model.</p>
  </div>
  <!-- Bar Graph -->
  <div class="mx-20 border border-gray-300 bg-gray-100 rounded-sm mt-10 h-96">
    <div>
      <p class="text-lg text-center font-sans">Training Loss By Round or Epoch</p>
      <div class="flex items-center justify-center">
        <div class="w-4 h-4 bg-blue-700 rounded-sm mr-2"></div>
        <span class="text-lg">Feature Importance</span>
      </div>
    </div>
  </div>
  <div class="mx-20 border-black mt-10">
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="py-2 px-4 text-left border-b border-gray-300 bg-gray-100">Feature Name</th>
          <th class="py-2 px-4  text-left border-b border-gray-300 bg-gray-100">Feature Importance Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="py-2 px-4 border-b">PetalWidthCm</td>
          <td class="py-2 px-4 border-b">0.33470824</td>
        </tr>
        <tr>
          <td class="py-2 px-4 border-b">PetalLengthCm</td>
          <td class="py-2 px-4 border-b">0.2863413</td>
        </tr>
        <tr>
          <td class="py-2 px-4 border-b">SepalWidthCm</td>
          <td class="py-2 px-4 border-b">0.20674689</td>
        </tr>
        <tr>
          <td class="py-2 px-4 border-b">SepalLengthCm</td>
          <td class="py-2 px-4 border-b">0.17220357</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="h-20">
  </div>
</div>


<style>
  /* Add your CSS styles here */
</style>
