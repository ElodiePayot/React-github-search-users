import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
  const {repos} = React.useContext(GithubContext);

  //retrouver les languages principaux des projets, pour construire le chart / retourne un objet
  const languages = repos.reduce((total, item) => {
    const {language, stargazers_count} = item;
    //élimine les valeurs nulles
    if (!language) return total;
    //si le compte pour le language X n'existe pas, on le crée et l'initialise à 1 / on en ressort ttes les infos dont on a besoin
    if (!total[language]) {
      total[language] = {
        label: language,
        value: 1,
        stars: stargazers_count
      };
    } else {
      //si le compte pour le language X existe déjà, on lui ajoute 1
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});

  //tri des languages par popularité + on en garde que 5
  const mostUsedLanguages = Object.values(languages).sort((a,b) => {
    return b.value - a.value
  }).slice(0,5);

  //Pour le chart on a besoin de value donc on passe le nombre de stars dans value
  const mostStars = Object.values(languages).sort((a,b) => {
    return b.stars - a.stars
  }).map((item) => {
    return {item, ...item.stars}
  }).slice(0,5);

  let {stars, forks} = repos.reduce((total, item) => {
    const {stargazers_count, name, forks} = item;
    total.stars[stargazers_count] = {label:name,value:stargazers_count};
    total.forks[forks] = {label:name, value:forks}
    return total;
  }, {
    stars:{},
    forks:{}
  })

  //on ne garde que les 5 valeurs les plus élévées, puis on les trie de la plus élevée à la moins élevée
  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(stars).slice(-5).reverse();


  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsedLanguages} />
        <Column3D data={stars} />
        <Doughnut2D data={mostStars} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
    
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
