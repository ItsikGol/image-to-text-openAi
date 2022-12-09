const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api')



const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const generateImage1 = async (req, res)=>{
  const response = await openai.createImageEdit(
    fs.createReadStream("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png"),
    fs.createReadStream("https://i.pcmag.com/imagery/articles/00Cx7vFIetxCuKxQeqPf8mi-23.fit_lim.size_1600x900.v1643131202.jpg"),
    "put phone inside on road",
    1,
    "1024x1024"
  );
  image_url = response.data.data[0].url;
  res.status(200).json({
    success: true,
    data: imageUrl,
  });
}

const generateImage = async (req, res) => {
  
  let { prompt, size } = req.body;
  const { text } = await translate(prompt, { to: 'en' });

  const imageSize =
    size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

  try {
    const response = await openai.createImage({
      prompt:text,
      n: 1,
      size: imageSize,
    });

    const imageUrl = response.data.data[0].url;

    res.status(200).json({
      success: true,
      data: imageUrl,
      text
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
};

module.exports = { generateImage };
