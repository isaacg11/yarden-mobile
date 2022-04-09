import React, { Component } from 'react';
import { View } from 'react-native';
import Link from '../UI/Link';
import Paragraph from '../UI/Paragraph';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../styles/fonts';
import units from '../styles/units';
import colors from '../styles/colors';

class Table extends Component {

  renderColumns(row) {

    // set initial columns
    let columns = [];

    // set excluded columns
    const excludedColumns = this.props.excludedColumns;

    // iterate through columns
    for (const column in row) {

      // if excluded columns {...}
      if (excludedColumns && excludedColumns.length > 0) {

        // check to see if column is excluded
        const columnIsExcluded = excludedColumns.find((col) => col === column);

        // if column is not excluded {...}
        if (!columnIsExcluded) {

          // if column is a url {...}
          if (column === 'url') {

            // format url and add to columns list
            columns.push({ url: row[column] });
          } else {

            // format price or text
            const text =
              column === 'price' ? `$${row[column].toFixed(2)}` : row[column];

            // add to columns list
            columns.push({ text: text });
          }
        }
      } else {
        // if column is a url {...}
        if (column === 'url') {

          // format url and add to columns list
          columns.push({ url: row[column] });
        } else {

          // format price or text
          const text =
            column === 'price' ? `$${row[column].toFixed(2)}` : row[column];

          // add to columns list
          columns.push({ text: text });
        }
      }
    }

    // render columns
    return columns.map((column, index) => {

      // if url {...}
      if (column.url) {
        // render link
        return (
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              padding: units.unit3,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            key={index}>
            <Paragraph numberOfLines={3}>
              <Link
                url={column.url}
                text={<Ionicons name="globe" size={fonts.h2} />}
              />
            </Paragraph>
          </View>
        );
      } else {
        // render text
        return (
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              padding: units.unit3,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            key={index}>
            <Paragraph numberOfLines={3}>{column.text}</Paragraph>
          </View>
        );
      }
    });
  }

  renderRow(row, index) {

    // render row
    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          justifyContent: index === 0 ? 'flex-start' : 'center',
          flexDirection: 'row',
          borderBottomColor: colors.greenD25,
          borderBottomWidth: 1,
          paddingVertical: units.unit2,
        }}
        key={index}>

        {/* render columns */}
        {this.renderColumns(row)}
      </View>
    );
  }

  renderHeaders(row) {

    // set initial headers
    let columns = [];

    // set excluded headers
    const excludedColumns = this.props.excludedColumns;

    // iterate through row
    for (const column in row) {

      // if excluded headers {...}
      if (excludedColumns && excludedColumns.length > 0) {

        // check to see if header is excluded
        const columnIsExcluded = excludedColumns.find((col) => col === column);

        // if header is not excluded {...}
        if (!columnIsExcluded) {

          // add header to headers list
          columns.push({ header: column });
        }
      } else {

        // add column to headers list
        columns.push({ header: column });
      }
    }

    // render columns
    return columns.map((column, index) => {
      return (
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: index === 0 ? 'flex-start' : 'center',
            padding: units.unit3,
          }}
          key={index}>
          <Paragraph
            numberOfLines={3}
            style={{
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {column.header}
          </Paragraph>
        </View>
      );
    });
  }

  render() {
    const { data } = this.props;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            flex: 1,
            alignSelf: 'stretch',
            flexDirection: 'row',
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
            paddingTop: units.unit5,
            paddingBottom: units.unit5,
          }}>
          {this.renderHeaders(data[0])}
        </View>
        {data.map((datum, index) => {
          return this.renderRow(datum, index);
        })}
      </View>
    );
  }
}

module.exports = Table;
