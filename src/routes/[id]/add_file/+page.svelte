<script lang="ts">
    let selectedFile: File | undefined;
    let url = 'https://apis.149segolte.dev/minor';
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    let id = $page.url.pathname.split("/")[1];
    
    function handleFileUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      selectedFile = (target.files && target.files[0]) || undefined;
    }
  
    async function uploadFile() {
      if (selectedFile) {
        let formData = new FormData();
        formData.append('data', selectedFile, selectedFile.name);
        formData.append('target', 'Species');
        
        try {
          let response = await fetch(`${url}/project/${id}/upload`, {
            method: 'POST',
            body: formData,
            redirect: 'follow'
          });
  
          if (response.ok) {
            let result = await response.text();
            console.log('File uploaded successfully:', result);
            goto(`/${id}`)
            // Optionally, do something with the response from the server
          } else {
            console.error('Error uploading file:', response.status);
            // Handle non-200 HTTP status codes
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          // Handle network or other errors
        }
      } else {
        alert('Please select a CSV file.');
      }
    }
  </script>

<div class="flex justify-center items-center mt-20">
    <div class="max-w-md bg-gray-400 p-6 rounded-md shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-center">Upload CSV File</h2>

        <label class="block text-gray-700 font-bold mb-2">
            <input type="file" accept=".csv" class="mt-2 p-2 border rounded w-full focus:outline-none" on:change="{handleFileUpload}">
        </label>

        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none" on:click="{uploadFile}">
            Upload
        </button>

        <p class="text-sm text-black mt-2">Upload your CSV file here.</p>
        <p class="text-sm text-black">Supported formats: .csv</p>
    </div>
</div>



<!-- <script lang="ts">
	import { goto } from "$app/navigation";
    let url = 'https://apis.149segolte.dev/minor';



    let res = await fetch(`${url}/project/:id/upload`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
    });
    const dataa = await res.json();
    goto("/")
    
}
</script>

<div class="flex justify-center items-center mt-20">
    <div class="max-w-md bg-gray-400 p-6 rounded-md shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-center">Upload CSV File</h2>

        <label for="data" class="block text-gray-700 font-bold mb-2">
            <input type="file" id="fileInput" accept=".csv" class="mt-2 p-2 border rounded w-full focus:outline-none">
        </label>

        <p class="text-sm text-black">Upload your CSV file here.</p>
        <p class="text-sm text-black">Supported formats: .csv</p>
</div>
</div> -->



