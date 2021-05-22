import styled, { keyframes  } from 'styled-components';
const fadeIn = keyframes`
    0% { opacity:0; transform: translateY(20px); }
    100% { opacity:1; transform: translateY(0);}
`;

const StyledWrapper = styled.div`
  animation: ${fadeIn} 1s;
  height: inherit;
  width:  inherit;
  display: inherit;
  flex: inherit;
  flex-direction: inherit;
  align-items: inherit;
  justify-content: inherit;
`;

const Wrapper = ({ children }: any) => {
    return <StyledWrapper>{children}</StyledWrapper>;
};

export default Wrapper;