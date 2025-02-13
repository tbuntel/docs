import { MenuListProps } from 'react-select';
import { StylesConfigFunction } from 'react-select/dist/declarations/src/styles';
import { ReactSelectOptGroup, ReactSelectOption } from 'src/components';

export const menuListStyles: StylesConfigFunction<MenuListProps<ReactSelectOption, false, ReactSelectOptGroup>> = (
  provided,
) => ({
  ...provided,
  height: 'initial',
  maxHeight: 'initial',
  boxShadow: '0px 24px 32px rgba(0, 0, 0, 0.05)',
  padding: 16,
});
