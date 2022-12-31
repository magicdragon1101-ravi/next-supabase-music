import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import Layout from "@components/layout/Layout";
import Shimer from "@components/systems/Shimer";
import Text from "@components/systems/Text";
import Title from "@components/systems/Title";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { populateData, options, optionsBarChart, optionsHorizontalBarChart } from '@utils/chartSetup'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const fetcher = url => axios.get(url).then(res => res.data)

export default function Home() {
  const { theme } = useTheme()
  const { data: genre, error: errorGenre } = useSWR(`${process.env.API_ROUTE}/api/statistics/genre`, fetcher)
  const { data: song, error: errorSong } = useSWR(`${process.env.API_ROUTE}/api/statistics/song`, fetcher)
  const { data: album, error: errorAlbum } = useSWR(`${process.env.API_ROUTE}/api/statistics/album`, fetcher)
  const [dataGenre, setDataGenre] = useState()
  const [dataSong, setDataSong] = useState()
  const [dataAlbum, setDataAlbum] = useState()
  const [windowWidth, setWindowWidth] = useState()

  useEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [windowWidth])

  useEffect(() => {
    if (genre !== undefined) setDataGenre(populateData(genre, "genre"))
    if (song !== undefined) setDataSong(populateData(song, "song"))
    if (album !== undefined) setDataAlbum(populateData(album, "album"))
  }, [genre, song, album])

  if (errorGenre || errorSong || errorAlbum) {
    return (
      <Layout title="Dashboard">
        <div className="flex h-[36rem] text-base items-center justify-center">Failed to load</div>
      </Layout>
    )
  }

  const optionBarChart = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#888"
        },
        grid: {
          color: theme == 'dark' ? "#3f3f46" : "#e2e8f0"
        }
      },
      y: {
        ticks: {
          color: "#888",
          stepSize: 1
        },
        grid: {
          color: theme == 'dark' ? "#3f3f46" : "#e2e8f0"
        }
      }
    }
  }
  return (
    <Layout title="Dashboard">
      <Title>Dashboard</Title>

      <div className="mt-5 md:mr-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {dataGenre ?
          <div className="rounded-md border dark:border-neutral-800 bg-white dark:bg-[#1F1F1F]">
            <div className="p-3 bg-neutral-100/80 dark:bg-neutral-800">
              <Text.semibold className="!text-sm">Total Artis by Genre</Text.semibold>
            </div>
            <div className="py-3 m-auto w-72">
              <Pie
                options={options}
                data={dataGenre}
              />
            </div>
          </div>
          :
          <Shimer className="w-full !h-60" />
        }

        {dataSong ?
          <div className="rounded-md border dark:border-neutral-800 bg-white dark:bg-[#1F1F1F]">
            <div className="p-3 bg-neutral-100/80 dark:bg-neutral-800">
              <Text.semibold className="!text-sm">Total Album by Artist</Text.semibold>
            </div>
            <div className="py-3 m-auto w-72">
              <Doughnut
                options={options}
                data={dataAlbum}
              />
            </div>
          </div>
          :
          <Shimer className="w-full !h-60" />
        }

        {dataAlbum ?
          <div className="rounded-md border dark:border-neutral-800 bg-white dark:bg-[#1F1F1F]">
            <div className="p-3 bg-neutral-100/80 dark:bg-neutral-800">
              <Text.semibold className="!text-sm">Total Song by Artist</Text.semibold>
            </div>
            <div className="p-3">
              <Bar
                options={optionsBarChart(theme)}
                data={dataSong}
              />
              {/* <Bar
                options={optionBarChart}
                data={dataSong}
              /> */}
            </div>
          </div>
          :
          <Shimer className="w-full !h-60" />
        }
      </div>

      <div className="mt-5 md:mr-2">
        {dataAlbum ?
          <div className="rounded-md border dark:border-neutral-800 bg-white dark:bg-[#1F1F1F]">
            <div className="p-3 bg-neutral-100/80 dark:bg-neutral-800">
              <Text.semibold className="!text-sm">Total Song by Artist</Text.semibold>
            </div>
            <div className="p-3">
              <Bar
                options={optionsHorizontalBarChart(theme, windowWidth)}
                data={dataSong}
                height={100}
              />
            </div>
          </div>
          :
          <Shimer className="w-full !h-60" />
        }
      </div>
    </Layout>
  );
}