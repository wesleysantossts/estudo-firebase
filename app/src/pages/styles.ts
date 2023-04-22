import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
  }

  .posts {
    margin: 20px 0;
    max-width: 300px;

    h2 {
      margin: 0 0 20px 0;
    }

    li {
      margin: 0 0 15px 10px;
      list-style: disc;
    }
  }
`;