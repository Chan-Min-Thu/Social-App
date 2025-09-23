import {
  FaceIcon,
  ImageIcon,
  ZoomInIcon,
} from "@radix-ui/react-icons";

export const createPostIcons =[
    {   
        name:"Image",
        icon:ImageIcon,
        input:true
    },
    {   
        name:"Icon",
        icon:FaceIcon,
        input:false
    },
    {   
        name:"Location",
        icon:ZoomInIcon,
        input:false
    }
]