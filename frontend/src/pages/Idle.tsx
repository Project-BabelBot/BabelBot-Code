import { Box, Button, Typography } from "@mui/material"
import logo from '../assets/logo.png';

const styles = {
header:{
  alignItems: "flex-start",
}
}

const Idle = () => {
  return (
    <Box>
      <Box sx = {styles.header}>
      <img 
      src={logo} 
      alt="BabelBot logo" 
      style={{width: 100, height: 100, alignSelf: 'flex-start'}}/>
      </Box>

      <Box><Typography>Insert Avatar</Typography></Box>
      <Button>Say "Hey BabelBot"</Button>
    </Box>
    
  )
}

export default Idle