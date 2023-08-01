'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

let intervalId: any = undefined;

export default function Home() {

  let [dogImage, setDogImage] = useState<string>();
  let [dogFact, setDogFact] = useState<string>();
  let [errorMessage, setErrorMessage] = useState<string>();

  const getDogImage = (): Promise<{message: string}> => {
    return fetch("https://dog.ceo/api/breeds/image/random").then((res) => res.json());
  }

  const getDogFact = (): Promise<{facts: Array<string>}> => {
    const factsToRequest = 1;
    return fetch(`https://dog-api.kinduff.com/api/facts?number=${factsToRequest}`).then((res) => res.json());
  }

  const updateDogs = (): void => {
    Promise.all([
      getDogImage(),
      getDogFact(),
    ]).then(([images, facts]) => {
      setDogImage(images.message);
      setDogFact(facts.facts[0]);

      setErrorMessage(undefined);
    }).catch(() => {
      setErrorMessage("We got an error, Trying to get those babies photos back.")
    })
    
  }

  useEffect(() => {
    if(intervalId) clearInterval(intervalId);
    updateDogs();
    intervalId = setInterval(updateDogs, 10000)
  }, [])
  return (
    <main className={styles.container}>
      {errorMessage?.length && <p className={`${styles.dogFact} ${styles.errorMessage}`}>{errorMessage}</p>}
      <img src={dogImage} className={styles.dogImage}/>
      <p className={styles.dogFact}>{dogFact}</p>
      <button onClick={updateDogs} className={styles.updateDogsButton}>Update</button>
    </main>
  )
}
