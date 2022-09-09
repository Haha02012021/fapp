import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage"
import { storage } from '../firebase/config'
import { v4 } from "uuid"
import { getAllImages, uploadImge } from './api/firebase'

export default function Home() {
  const [file, setFile] = useState([])
  const [imgList, setImgList] = useState([])

  const imageListRef = ref(storage, "images/")

  useEffect(() => {
    const getImages = async () => {
      await getAllImages(imageListRef, setImgList)
    }

    getImages()

    return () => {
      setImgList([])
    }
  }, [])

  const handleChangeFiles = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    const url = await uploadImge(file, "images")
    console.log("url", url);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Test</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <input type="file" onChange={handleChangeFiles} webkitdirectory />
        <button onClick={handleUpload}>Upload</button>
        {imgList?.map((img, index) => {
          return (
            <img src={img} key={index} />
          )
        })}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
