'use client';
import { useEffect, useMemo } from 'react';
import { emptyExhibitLabel, gallerySlots, type RealmId } from '@/data/portfolio';
import { Books, Box, Frame, Lantern, Plant } from '../Objects';
import { branch, grownTrunk } from './geometry';
import { ContactShadow } from './Studio';
import { ExhibitLabel, ExhibitionArchitecture } from './ExhibitionArchitecture';
import ProjectAtom from './ProjectAtom';
import WorldArtifact from './WorldArtifact';

export default function Realms({
  realm,
  inspect,
  inspected,
  reduced,
}: {
  realm: RealmId;
  inspect: (i: number, at?: [number, number, number]) => void;
  inspected: number | null;
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
  const roomColor =
    realm === 'motion' || realm === 'code' ? '#20252d' : realm === 'art' ? '#4b5b42' : '#34483e';
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
      <mesh position-y={-0.17} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[7, 64]} />
        <meshStandardMaterial color="#555c49" roughness={1} />
      </mesh>
      <ContactShadow position={[0, 0.01, -2]} scale={[5, 3, 1]} />
      {realm !== 'books' && <Box size={[12, 5, 0.15]} position={[0, 2.4, -4]} color={roomColor} />}
      {realm === 'books' && (
        <>
          <mesh geometry={tree} position={[0, 0, -5.8]}>
            <meshStandardMaterial color="#666344" roughness={1} />
          </mesh>
          {limbs.map((g, i) => (
            <mesh key={i} geometry={g}>
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
            reduced={reduced}
            inspect={(index, point) => inspect(index, [point.x, point.y, point.z])}
          />
          <pointLight position={[0, 2, -1]} intensity={8} color="#a0c7c3" distance={8} />
        </>
      )}
      {realm === 'design' && <ExhibitionArchitecture greenhouse={false} />}
      {realm === 'art' && (
        <>
          <ExhibitionArchitecture greenhouse />
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
          <mesh position={[0, 2.7, -3.88]}>
            <planeGeometry args={[5, 2.8]} />
            <meshStandardMaterial color="#bdbdaa" emissive="#82948b" emissiveIntensity={0.3} />
          </mesh>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 4.3, 2.4, -3.6]}>
              {Array.from({ length: 10 }, (_, i) => (
                <mesh key={i} position={[i * 0.1 * s, 0, Math.sin(i * 1.5) * 0.08]}>
                  <cylinderGeometry args={[0.09, 0.1, 4.7, 12]} />
                  <meshStandardMaterial color="#642b40" roughness={1} />
                </mesh>
              ))}
            </group>
          ))}
          <mesh position={[4.6, 0.7, 1.5]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
            <meshStandardMaterial color="#a29674" metalness={0.6} />
          </mesh>
        </>
      )}
      {realm !== 'code' &&
        slots.map((entry, i) => (
          <group key={entry?.id ?? i} position={[(i - 1) * 2.8, 0, 0]}>
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
            <Lantern position={[0, 3.5, -3.05]} />
          </group>
        ))}
      {[-5, 5].map((x) => (
        <Plant key={x} position={[x, 0, -3]} scale={1.3} />
      ))}
      {!reduced && realm === 'motion' && (
        <pointLight position={[0, 3, 3]} color="#d9dfd2" intensity={9} distance={10} />
      )}
    </group>
  );
}
