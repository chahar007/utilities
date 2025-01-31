const fs = require('fs');

// Configuration for the keys to collect
const config = {
  objectKey: 'GAME_SUMMARY', // The key of the object we want to extract
  nestedKeys: ['title', 'slug', 'subtitle', 'bannerImage', 'description'], // The nested keys we want to collect from the object
  outputFile: 'collected_data.json' // Output file where we will save the collected data
};

// Function to collect data based on config
const collectData = (sourceFile, config) => {
    console.log('sourceFile', sourceFile);
  
  try {
    // Use require to load the JavaScript file (app.constant.js)
    const jsonData = require(sourceFile);

    // Extract the required object from the JSON data based on the config
    const objectToCollect = jsonData[config.objectKey];
    if (!objectToCollect) {
      console.log(`No object found for key: ${config.objectKey}`);
      return;
    }

    // Collect data from the object and its nested keys
    // const collectedData = collectAllSlugFromGames(objectToCollect);
    const siteMapData = generateSiteMapData(objectToCollect);

    console.log("collectedData game summary", siteMapData.length);
    
    // let missingSlug = findMissingRelatedGamesSlug(jsonData, collectedData);
    
    // console.log("collectedData", missingSlug.length);


    // let dataToWriteInFile = {
    //   collectedData,
    //   missingSlug
    // }

    // Write the collected data to the output file
    writeData(config, siteMapData);

  } catch (parseError) {
    console.error(`Error reading the file: ${parseError}`);
  }
};


const generateSiteMapData = (data)  =>{ 
  let siteMap = [];
  let url = 'https://gameplay.in.net/game-detail/';
  data.forEach((data) => {
    siteMap.push(url + data.slug)
  })

  return siteMap;
}


const collectAllSlugFromGames = (objectToCollect) => {
  let category = new Set();
  let data =  Object.keys(objectToCollect).map((item) => {
    objectToCollect[item].category.forEach((item) => {
      category.add(item);
    })
    return {
      title: objectToCollect[item].title,
      slug: item,
      subtitle: objectToCollect[item].subtitle,
      bannerImage: objectToCollect[item].bannerImage,
      description: objectToCollect[item].description,
      category: objectToCollect[item].category
    }
  });

  category = [...category];

  return [category,data];
}


const findMissingRelatedGamesSlug = (jsonData, collectedData) => {
  // Initialize an empty array to store the slugs from the relatedGames
  let totalRelatedSlugs = new Set();

  // Extract the 'GAME_DETAILS' object from jsonData
  const objectToCheck = jsonData['GAME_DETAILS'];

  Object.keys(objectToCheck).forEach((item) => {
    objectToCheck[item].relatedGames.forEach((rel) => {
      totalRelatedSlugs.add(rel.slug); 
    });
  });
  
  totalRelatedSlugs = [...totalRelatedSlugs];
  console.log("totalRelatedSlugs", totalRelatedSlugs.length);


  // Initialize the missingSlug array
  let missingSlug = [];

  totalRelatedSlugs.forEach((item) => {
    if (!collectedData.includes(item)) {
      missingSlug.push(item);
    }
  });

  // Return the missingSlugs
  return missingSlug;
};



const findMissingSlug = (jsonData, collectedData) => {
  const objectToCheck  = jsonData['GAME_DETAILS'];
  let missingSlug = [];
  collectedData.forEach((item)=> {
    if(!objectToCheck[item.slug]) {
      missingSlug.push(item.slug);
    }
  })

  return missingSlug;

}




const writeData = (config, collectedData)  => {
  try {
    fs.writeFile(config.outputFile, JSON.stringify(collectedData, null, 2), (err) => {
      if (err) {
        console.error(`Error writing to file: ${err}`);
      } else {
        console.log(`Data successfully written to ${config.outputFile}`);
      }
    });
  } catch {
    console.error(`Error writing the file: ${parseError}`);
  }
}

// Usage
const sourceFile = './data.js'; // Input file containing the JavaScript object
collectData(sourceFile, config);
