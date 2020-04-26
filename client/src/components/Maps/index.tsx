import React, { useRef, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useSelectedGroup } from '../../state/selectors'
import { selectGroup } from '../../state/reducers/groups'
import { useGroupClusters } from './useGroupClusters'
import withGoogleScript from './withGoogleScript'
import useMap from './hooks/useMap'
import InfoBox from '../InfoBox'

const Map = () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const selected = useSelectedGroup()
  const elem = useRef<HTMLDivElement>(null)
  const [map, setZoom] = useMap(elem)

  const selectMarker = useGroupClusters(
    map,
    useMemo(() => ({ disable: pathname !== '/', onSelect: (grp) => dispatch(selectGroup(grp)) }), [
      dispatch,
      pathname,
    ])
  )

  useEffect(() => {
    if (!map.current || !selected) return
    selectMarker(selected?.id || '')
    if (selected && map.current.getZoom() < 11) setZoom(12)
    map.current.panTo(selected.location_coord)
  }, [selected, setZoom, map, selectMarker])

  return (
    <MapStyles>
      <InfoBox />
      <div id="map" ref={elem} style={{ width: '100%', flex: '1 1 100%' }} />
    </MapStyles>
  )
}

export default withGoogleScript(Map)

const MapStyles = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  #map {
    width: 100%;
    height: 100%;
  }
  .map-cluster-icon {
    img {
      width: 100%;
    }
  }
`
