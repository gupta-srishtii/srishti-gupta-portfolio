'use client';
import { useEffect, useMemo } from 'react';
import { emptyExhibitLabel, gallerySlots, type RealmId } from '@/data/portfolio';
import { Books, Box, Frame, Plant } from '../Objects';
import { branch, grownTrunk } from './geometry';
import { ContactShadow } from './Studio';
import { ExhibitLabel, GreenhouseArchitecture } from './ExhibitionArchitecture';
import ProjectAtom from './ProjectAtom';
import WorldArtifact from './WorldArtifact';
import WorldBackdrop from './WorldBackdrop';
import {
  Easel,
  GalleryHangers,
  PigmentHalo,
  ProjectorBeam,
  PrototypeStation,
} from './ExhibitDetails';

export default function Realms({
  realm,
  inspect,
  inspected,
  charging,
  mobile,
  reduced,
}: {
  realm: RealmId;
  inspect: (i: number, at?: [number, number, number]) => void;
  inspected: number | null;
  charging?: number;
  mobile: boolean;
  reduced: boolean;
}) {
  const slots = gallerySlots(realm);
  const tree = useMemo(() => grownTrunk(4, 7, 0.65), []);
  const limbs = useMemo(
    () =>
      [-1, 1].flatMap((s) =>
        [0, 1, 2].map((i) =>
          branch(
            [
              [0, 2 + i * 0.8, -4],
              [s * 1.1, 3 + i * 0.9, -3.8],
              [s * 2.8, 3.5 + i * 0.8, -3.3],
            ],
            0.12,
          ),
        ),
      ),
    [],
  );
  useEffect(
    () => () => {
      tree.dispose();
      limbs.forEach((g) => g.dispose());
    },
    [tree, limbs],
  );
  const artifact =
    realm === 'books'
      ? 'book'
      : realm === 'honors' || realm === 'gifts'
        ? 'keepsake'
        : realm === 'motion'
          ? 'film'
          : null;
  return (
    <group>
      <WorldBackdrop key={realm} realm={realm} />
      {realm === 'code' && (
        <mesh position={[0, -0.14, -2.7]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[2.9, 3.05, 96]} />
          <meshBasicMaterial color="#a69062" transparent opacity={0.73} />
        </mesh>
      )}
      <ContactShadow position={[0, 0.01, -2]} scale={[5, 3, 1]} />
      {realm === 'books' && (
        <>
          <mesh geometry={tree} position={[-4, 0, -6.8]} rotation-z={-0.18}>
            <meshStandardMaterial color="#666344" roughness={1} />
          </mesh>
          {limbs.map((g, i) => (
            <mesh key={i} geometry={g} position={[-3.7, 0, -1.4]}>
              <meshStandardMaterial color="#6f714c" />
            </mesh>
          ))}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 2, 2.8, -3.5]} rotation-z={s * 0.12}>
              <Books position={[0, 0, 0]} count={4} />
              <Plant position={[s * 0.4, 0.7, 0]} scale={0.65} />
            </group>
          ))}
        </>
      )}
      {realm === 'code' && (
        <>
          <ProjectAtom
            slots={slots}
            inspected={inspected}
            charging={charging}
            compact={mobile}
            reduced={reduced}
            inspect={(index, point) => inspect(index, [point.x, point.y, point.z])}
          />
          <pointLight position={[0, 2, -1]} intensity={8} color="#a0c7c3" distance={8} />
        </>
      )}
      {realm === 'art' && (
        <>
          <GreenhouseArchitecture />
          {[-4, -2, 2, 4].map((x) => (
            <Plant key={x} position={[x, 0, -2]} scale={1.3} />
          ))}
        </>
      )}
      {realm === 'honors' || realm === 'gifts' ? (
        <>
          {[-4.7, 4.7].map((x) => (
            <group key={x}>
              {[0.5, 1.3, 2.1, 2.9].map((y) => (
                <group key={y}>
                  <Box size={[1.4, 0.09, 0.7]} position={[x, y, -3.5]} color="#715b41" />
                  <Books position={[x - 0.5, y + 0.05, -3.5]} count={4} />
                </group>
              ))}
            </group>
          ))}
        </>
      ) : null}
      {realm === 'motion' && (
        <>
          {!reduced && <ProjectorBeam active={inspected !== null} />}
          <mesh position={[4.6, 0.7, 1.5]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
            <meshStandardMaterial color="#a29674" metalness={0.6} />
          </mesh>
        </>
      )}
      {realm !== 'code' &&
        slots.map((entry, i) => (
          <group key={entry?.id ?? i} position={[(i - 1) * 2.8, 0, 0]}>
            {realm === 'art' && <Easel />}
            {realm === 'design' && <GalleryHangers />}
            {realm === 'ux' && <PrototypeStation />}
            {realm === 'art' && inspected === i && (
              <group position={[0, 2.1, -3.44]}>
                <PigmentHalo visible reduced={reduced} />
              </group>
            )}
            {artifact && !entry?.image ? (
              <group position={[0, realm === 'motion' ? 1.5 : 2.1, -3.44]}>
                <WorldArtifact
                  kind={artifact}
                  activate={() => inspect(i)}
                  selected={inspected === i}
                  reduced={reduced}
                />
              </group>
            ) : (
              <Frame
                position={[0, realm === 'motion' ? 1.5 : 2.1, -3.6]}
                image={entry?.image}
                onClick={() => inspect(i)}
                color={['#596159', '#52615c', '#73624e'][i % 3]}
              />
            )}
            <ExhibitLabel
              position={[0, realm === 'motion' ? 0.48 : 0.86, -3.47]}
              title={entry?.title ?? emptyExhibitLabel(realm, i)}
              status={entry?.medium ?? (entry ? '' : 'AWAITING APPROVED WORK')}
            />
            {['design', 'ux', 'art'].includes(realm) && (
              <pointLight
                position={[0, 3.25, -2.7]}
                intensity={realm === 'art' ? 2.1 : 3.8}
                distance={3.7}
                color={realm === 'ux' ? '#a9d7e8' : '#ffd3a0'}
              />
            )}
          </group>
        ))}
      {!reduced && realm === 'motion' && (
        <pointLight position={[0, 3, 3]} color="#d9dfd2" intensity={9} distance={10} />
      )}
    </group>
  );
}
