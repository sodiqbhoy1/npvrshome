import React from 'react'

const Footer = () => {
	return (
		<footer className="bg-white border-t border-blue-100 py-6 mt-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
				<p>
					© {new Date().getFullYear()} NPVRS • Super Admin Console
				</p>
			</div>
		</footer>
	)
}

export default Footer
