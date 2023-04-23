import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 40px;

  .form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    
    h2 {
      margin: 15px 0;
    }
  }

  .posts {
    margin: 20px 0;
    max-width: 300px;


    ul {
      list-style: disc;
      padding: 0 15px;
    }

    li {
      display: flex;
      flex-direction: column;
      margin: 0 0 15px 10px;
    }
  }
`;