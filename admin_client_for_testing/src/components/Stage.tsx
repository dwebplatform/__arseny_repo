import { useState } from 'react'
import Joi from 'joi'

export interface IStage {
  id: number
  theoryPart: string
  challenges: Array<any>
}

export enum ChallengeType {
  FindBySound = 'FindBySound',
  TranslateVideo = 'TranslateVideo',
  TranslateByBlocks = 'TranslateByBlocks',
}

const CHALLENGE_TYPES: ChallengeType[] = [
  ChallengeType.FindBySound,
  ChallengeType.TranslateVideo,
  ChallengeType.TranslateByBlocks,
]

//* before sanding check type
const rightOrderSchema = Joi.object().keys({
  correctWords: Joi.array(),
  words: Joi.array(),
})

export const Stage = ({ stage }: { stage: IStage }) => {

  const [addedChallenge, setAddedChallenge] = useState<any>({
    type: CHALLENGE_TYPES[0],
    payload: '',
  })
  const addChallenge = async () => {
    console.log({
      type: addedChallenge.type,
      payload: JSON.parse(addedChallenge.payload),
      id: stage.id
    })
    try {
      const response = await fetch(`http://localhost:5000/level/create-challenge-for-stage`, {
        method: 'POST',
        body: JSON.stringify({
          type: addedChallenge.type,
          payload: JSON.parse(addedChallenge.payload),
          id: stage.id
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (err) {
      console.log(err)
    }
    }

  return (
    <div className="stage">
      <textarea
        style={{ width: '560px', height: '60px' }}
        value={stage.theoryPart}
      />
      <div className="add-challenge-form">
        <select
          onChange={(e) => {
            setAddedChallenge((prevData: any) => {
              return {
                ...prevData,
                type: e.target.value,
              }
            })
          }}
        >
          {CHALLENGE_TYPES.map((challenge) => {
            return <option value={challenge}>{challenge}</option>
          })}
        </select>
        <textarea
          className="added-challenge-payload"
          placeholder="Введите payload"
          value={addedChallenge.payload}
          onChange={(e) => {
            setAddedChallenge((prevData: any) => {
              return {
                ...prevData,
                payload: e.target.value,
              }
            })
          }}
        />
        <button onClick={addChallenge}>Добавить challenge</button>
      </div>
      <div className="stage-challenges-list">
        {stage.challenges.map((challenge) => {
          return (
            <div key={challenge.id} className="stage-challenge">
              <div>{challenge.type}</div>
              <div>{JSON.stringify(challenge.payload)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
