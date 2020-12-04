import fetchMock from 'jest-fetch-mock'
import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'
import '@testing-library/jest-dom'

configure({ adapter: new Adapter() })
fetchMock.enableMocks()
