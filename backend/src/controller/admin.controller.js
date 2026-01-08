import cloudinary from "../lib/cloudinary.js";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }
    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.body.audioFile;
    const imageFile = req.body.imageFile;
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });
    await song.save();
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(200).json(song);
  } catch (error) {
    console.log({ message: "Error in createSong", error });
    next(error);
  }
};
// export const addUser
const uploadToCloudinary=async (file)=>{
      try{
            const result =await cloudinary.oploader.upload(file.tempFilePath,{
                  resource_type:"auto",
            })
            return result.secure_url
      }catch(error){
            console.log("Error in uploadToCloudinary",error);
            throw new Error(error);
      }
}
export const deleteSong=async(req,res,next)=>{
      try{
            const {id}=req.params
            const song =await Song.findById(id)
            if(song.albumId){
                  await Album.findByIdAndUpdate(song.albumId,{
                        $pull:{songs:song._id}
                  })
            }
            await Song.findByIdAndDelete(id)
            res.status(200).json({message:"SOng deleted successfully"})
      }catch(error){
            console.log("Error in deleting ",error)
            next(error)
      }
}