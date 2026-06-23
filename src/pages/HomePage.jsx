import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import UnitCard from '../components/units/UnitCard'
import { supabase } from '../lib/supabase'

const HERO_BG = '/el-dorado-hero.png'

const BUILDING_FEATURES = [
  {
    icon: '🏛',
    title: 'Historic Architecture',
    body: 'Built in 1913, El Dorado\'s Spanish Renaissance facade, ornate lobby, and original detailing offer production designers an authentic period backdrop rarely found in working residential buildings.',
  },

  

  {
    icon: '🎬',
    title: 'Multiple Looks, One Address',
    body: 'From raw industrial lofts to polished modern interiors, furnished suites to blank-canvas spaces — every unit offers a different visual story. One location fee, infinite production value.',
  },
  {
    icon: '📋',
    title: 'Straightforward Process',
    body: 'A clear set of filming guidelines, COI requirements, and a single point of contact makes El Dorado easy to book and even easier to work in. We\'ve hosted productions of every size.',
  },
  {
    icon: '🌆',
    title: 'Downtown Los Angeles Access',
    body: 'Located in the Spring Street Arts Corridor, minutes from DTLA production infrastructure, grip houses, and staging facilities. Ample street-level loading access.',
  },
  {
    icon: '🏢',
    title: 'Common Areas Available',
    body: 'The lobby, corridors, stairwells, rooftop, and exterior may be available for permitted filming. Contact the building manager to discuss common area access.',
