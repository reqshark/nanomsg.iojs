{
  'targets': [
    {
      'target_name' : 'nanomsg',
      'include_dirs': [ '<!(node -e "require(\'nan\')")' ],
      'sources': [ 'lib/nanomsg.cc' ],
      'libraries': [ '-lnanomsg' ]
    }
  ]
}
